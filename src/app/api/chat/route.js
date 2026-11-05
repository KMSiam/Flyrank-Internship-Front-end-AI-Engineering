import { SYSTEM_PROMPT, MODEL_CONFIG, getSimulatedResponse } from '../../../lib/aiConfig.js';

export const runtime = 'nodejs';

/**
 * Streaming Chat API Route Handler (FE-06 / FE-08).
 * Emits Server-Sent Events (SSE) message stream token-by-token.
 * Handles failure modes, edge cases, and sabotage test triggers (FE-08).
 */
export async function POST(req) {
  try {
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
              'Connection': 'keep-alive'
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

        if (!isAborted) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'finish', finishReason: 'stop' })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        }

        controller.close();
      }
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    return Response.json(
      { error: error.message || 'Internal streaming error', code: 'ERR_INTERNAL_EXCEPTION' },
      { status: 500 }
    );
  }
}
