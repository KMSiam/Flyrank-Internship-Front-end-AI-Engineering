import { SYSTEM_PROMPT, MODEL_CONFIG, getSimulatedResponse } from '../../../lib/aiConfig.js';

export const runtime = 'nodejs';
// Enforce sensible maxDuration on streaming handlers for serverless deployment
export const maxDuration = 30; // 30 seconds ceiling

// In-Memory Sliding Window Rate Limiter (Protects API against trivial abuse & credit exhaustion)
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute per IP
const MAX_PROMPT_CHAR_LIMIT = 4000; // 4000 characters input cap

const ipRequestMap = new Map();

/**
 * Prune stale timestamps and check rate limit for a client IP.
 */
function checkRateLimit(ip) {
  const now = Date.now();
  const timestamps = ipRequestMap.get(ip) || [];
  
  // Retain only requests within the active window
  const recentTimestamps = timestamps.filter(time => now - time < RATE_LIMIT_WINDOW_MS);

  if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestTimestamp = recentTimestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldestTimestamp)) / 1000));
    return {
      limited: true,
      retryAfter: retryAfterSeconds,
      remaining: 0
    };
  }

  recentTimestamps.push(now);
  ipRequestMap.set(ip, recentTimestamps);

  // Periodic cleanup if map grows large
  if (ipRequestMap.size > 1000) {
    for (const [key, times] of ipRequestMap.entries()) {
      const valid = times.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
      if (valid.length === 0) {
        ipRequestMap.delete(key);
      } else {
        ipRequestMap.set(key, valid);
      }
    }
  }

  return {
    limited: false,
    retryAfter: 0,
    remaining: MAX_REQUESTS_PER_WINDOW - recentTimestamps.length
  };
}

/**
 * Streaming Chat API Route Handler (FE-06 / FE-08 / FE-11).
 * Emits Server-Sent Events (SSE) message stream token-by-token.
 * Enforces production rate limiting, input character capping, and failure modes.
 */
export async function POST(req) {
  try {
    // 1. Production Rate Limiter & Abuse Protection
    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    
    const rateCheck = checkRateLimit(clientIp);
    if (rateCheck.limited) {
      return Response.json(
        {
          error: `Rate limit exceeded: Too many requests from this IP. Maximum ${MAX_REQUESTS_PER_WINDOW} requests/minute.`,
          code: 'ERR_RATE_LIMIT_EXCEEDED',
          retryAfter: rateCheck.retryAfter,
          timestamp: new Date().toISOString()
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.retryAfter),
            'X-RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil((Date.now() + rateCheck.retryAfter * 1000) / 1000))
          }
        }
      );
    }

    const sabotageHeader = req.headers.get('x-sabotage-scenario');
    const { messages = [], model = MODEL_CONFIG.defaultModel, sabotage = null } = await req.json();

    const activeSabotage = sabotage || sabotageHeader;

    // Edge Case 1: Empty or whitespace input validation
    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage?.content?.trim();

    if (!userPrompt) {
      return Response.json(
        {
          error: 'Input validation failed: Prompt content cannot be blank or empty.',
          code: 'ERR_EMPTY_INPUT',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    // Input Cap Hygiene: Input exceeds safe max character ceiling
    if (userPrompt.length > MAX_PROMPT_CHAR_LIMIT) {
      return Response.json(
        {
          error: `Input cap exceeded: Prompt length (${userPrompt.length} chars) exceeds the maximum allowed limit of ${MAX_PROMPT_CHAR_LIMIT} characters.`,
          code: 'ERR_INPUT_CAP_EXCEEDED',
          maxLength: MAX_PROMPT_CHAR_LIMIT,
          actualLength: userPrompt.length,
          timestamp: new Date().toISOString()
        },
        { status: 413 }
      );
    }

    // Sabotage Case 1: 429 Rate Limit Simulation
    if (activeSabotage === 'ratelimit' || userPrompt.includes('TRIGGER_RATE_LIMIT_429')) {
      return Response.json(
        {
          error: '429 Too Many Requests: Upstream model token quota exceeded. Please wait 15 seconds before retrying.',
          code: 'ERR_RATE_LIMIT_429',
          retryAfter: 15,
          timestamp: new Date().toISOString()
        },
        {
          status: 429,
          headers: { 'Retry-After': '15' }
        }
      );
    }

    // Sabotage Case 2: 503 Provider Outage
    if (activeSabotage === 'network' || userPrompt.includes('TRIGGER_NETWORK_FAIL')) {
      return Response.json(
        {
          error: '503 Service Unavailable: Network route to LLM cluster unreachable.',
          code: 'ERR_NETWORK_UNREACHABLE',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }

    // Check for server-side Anthropic / AI provider keys
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.AI_PROVIDER_KEY;

    // If valid Anthropic API key exists and no sabotage mode requested, call real Anthropic API
    if (!activeSabotage && apiKey && apiKey.startsWith('sk-ant-') && !apiKey.includes('placeholder')) {
      try {
        const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-7-sonnet-20250219',
            max_tokens: MODEL_CONFIG.maxOutputTokens,
            temperature: MODEL_CONFIG.temperature,
            system: SYSTEM_PROMPT,
            messages: messages.map(m => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.content
            })),
            stream: true
          }),
          signal: req.signal
        });

        if (anthropicRes.ok) {
          return new Response(anthropicRes.body, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache, no-transform',
              'Connection': 'keep-alive',
              'X-RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
              'X-RateLimit-Remaining': String(rateCheck.remaining)
            }
          });
        }
      } catch (err) {
        console.warn('Anthropic upstream error, falling back to deterministic stream:', err);
      }
    }

    // High-Fidelity Streaming Engine with Sabotage Hooks
    const fullText = getSimulatedResponse(userPrompt, messages.length);
    const words = fullText.split(' ');

    const encoder = new TextEncoder();
    let isAborted = false;

    if (req.signal) {
      req.signal.addEventListener('abort', () => {
        isAborted = true;
      });
    }

    const isMidstreamSabotage = activeSabotage === 'midstream' || userPrompt.includes('TRIGGER_MIDSTREAM_ERROR');
    const isSlowSabotage = activeSabotage === 'slow' || userPrompt.includes('TRIGGER_SLOW_RESPONSE');

    const readable = new ReadableStream({
      async start(controller) {
        // Pending state delay (standard 150ms or slow 2500ms to observe skeleton stability)
        const initialDelay = isSlowSabotage ? 2500 : 150;
        await new Promise(r => setTimeout(r, initialDelay));

        for (let i = 0; i < words.length; i++) {
          if (isAborted) {
            break;
          }

          // Sabotage Case 3: Mid-Stream Failure after 3 tokens
          if (isMidstreamSabotage && i >= 3) {
            const errPayload = JSON.stringify({
              type: 'error',
              code: 'ERR_MIDSTREAM_DROP',
              message: 'Upstream SSE pipe severed mid-stream: Connection reset by peer.',
              failedAtToken: i,
              timestamp: new Date().toISOString()
            });
            controller.enqueue(encoder.encode(`data: ${errPayload}\n\n`));
            controller.close();
            return;
          }

          const word = (i === 0 ? '' : ' ') + words[i];
          const payload = JSON.stringify({
            type: 'text-delta',
            text: word
          });

          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          // Realistic pacing: 30ms between tokens
          await new Promise(r => setTimeout(r, 30));
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
        'X-RateLimit-Remaining': String(rateCheck.remaining)
      }
    });
  } catch (error) {
    return Response.json(
      {
        error: error.message || 'Fatal internal error in streaming chat endpoint.',
        code: 'ERR_INTERNAL_SERVER',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
