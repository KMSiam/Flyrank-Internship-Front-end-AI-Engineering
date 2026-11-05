import { SYSTEM_PROMPT, MODEL_CONFIG, getSimulatedResponse } from '../../../lib/aiConfig.js';

export const runtime = 'nodejs';

/**
 * Streaming Chat API Route Handler (FE-06).
 * Emits Server-Sent Events (SSE) message stream token-by-token.
 * API keys live strictly server-side.
 */
export async function POST(req) {
  try {
    const { messages = [], model = MODEL_CONFIG.defaultModel } = await req.json();

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage?.content || 'Hello';

    // 1. Check for server-side Anthropic / AI provider keys
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.AI_PROVIDER_KEY;

    // 2. If valid Anthropic API key exists and is not a placeholder, call real Anthropic API
    if (apiKey && apiKey.startsWith('sk-ant-') && !apiKey.includes('placeholder')) {
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
          // Pass-through Anthropic SSE stream
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

    // 3. Fallback High-Fidelity Streaming Engine
    // Emits token-by-token SSE stream with realistic human typing cadence (35ms per word).
    const fullText = getSimulatedResponse(userPrompt, messages.length);
    const words = fullText.split(' ');

    const encoder = new TextEncoder();
    let isAborted = false;

    if (req.signal) {
      req.signal.addEventListener('abort', () => {
        isAborted = true;
      });
    }

    const readable = new ReadableStream({
      async start(controller) {
        // Initial thinking phase delay (150ms) to trigger thinking indicator handoff
        await new Promise(r => setTimeout(r, 150));

        for (let i = 0; i < words.length; i++) {
          if (isAborted) {
            break;
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
      { error: error.message || 'Internal streaming error' },
      { status: 500 }
    );
  }
}
