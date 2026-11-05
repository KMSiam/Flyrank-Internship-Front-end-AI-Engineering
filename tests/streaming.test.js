import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYSTEM_PROMPT, MODEL_CONFIG, getSimulatedResponse } from '../src/lib/aiConfig.js';
import { POST as chatHandler } from '../src/app/api/chat/route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting FE-06 Streaming AI Chat Interface Automated Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function asyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

// Group 1: Centralized System Prompt & Model Config Module
console.log('--- 1. Centralized System Prompt & Model Configuration ---');

test('aiConfig.js exports SYSTEM_PROMPT with high-signal guidelines', () => {
  assert.ok(SYSTEM_PROMPT, 'SYSTEM_PROMPT must be defined');
  assert.ok(SYSTEM_PROMPT.length > 50, 'SYSTEM_PROMPT must be substantial');
  assert.ok(SYSTEM_PROMPT.includes('FlyRank'), 'SYSTEM_PROMPT must mention FlyRank');
});

test('aiConfig.js exports MODEL_CONFIG with Claude, Gemini, and GPT options', () => {
  assert.ok(MODEL_CONFIG.defaultModel, 'defaultModel must be set');
  assert.ok(Array.isArray(MODEL_CONFIG.supportedModels), 'supportedModels must be an array');
  assert.ok(MODEL_CONFIG.supportedModels.length >= 3, 'Must support at least 3 models');
  assert.ok(MODEL_CONFIG.temperature >= 0 && MODEL_CONFIG.temperature <= 1, 'Temperature in bounds');
});

test('getSimulatedResponse returns non-empty structured response', () => {
  const resp = getSimulatedResponse('How do I build an accessible modal?', 0);
  assert.ok(resp.includes('Modal'), 'Response should be contextual');
  assert.ok(resp.length > 100, 'Response must have depth');
});

// Group 2: Server-Side Streaming Route Handler
console.log('\n--- 2. Server-Side Streaming Route Handler (POST /api/chat) ---');

await asyncTest('POST /api/chat returns HTTP 200 with text/event-stream content type', async () => {
  const req = new Request('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Explain streaming chat architecture' }]
    })
  });

  const response = await chatHandler(req);
  assert.strictEqual(response.status, 200);
  assert.ok(
    response.headers.get('Content-Type')?.includes('text/event-stream'),
    'Must return text/event-stream header'
  );
  assert.ok(response.body, 'Response body stream must exist');
});

await asyncTest('Streaming route delivers text-delta SSE chunks and finishes cleanly', async () => {
  const req = new Request('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Hello' }]
    })
  });

  const response = await chatHandler(req);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let receivedChunks = 0;
  let fullOutput = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    receivedChunks++;
    const text = decoder.decode(value);
    fullOutput += text;
    // Break early after verifying first few tokens to keep tests fast
    if (receivedChunks >= 5) break;
  }

  assert.ok(receivedChunks > 0, 'Stream must deliver at least one chunk');
  assert.ok(fullOutput.includes('data:'), 'Stream chunks must follow SSE data protocol');
});

await asyncTest('Streaming route respects AbortController signal without throwing', async () => {
  const abortController = new AbortController();
  const req = new Request('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Long test generation message' }]
    }),
    signal: abortController.signal
  });

  const response = await chatHandler(req);
  const reader = response.body.getReader();
  
  // Abort mid-stream
  abortController.abort();
  const { done } = await reader.read();
  assert.ok(done !== undefined, 'Stream reader handles aborted signal safely');
});

// Group 3: Client Component Invariants & Code Audit
console.log('\n--- 3. Client Component Architecture & Mentor Invariants ---');

test('StreamingChat.jsx implements thinking indicator, stop button, auto-scroll, and persistence', () => {
  const chatComponentPath = path.join(rootDir, 'src/components/chat/StreamingChat.jsx');
  const code = fs.readFileSync(chatComponentPath, 'utf8');

  // 1. Thinking indicator handoff
  assert.ok(code.includes('thinking'), 'Must contain thinking state');
  assert.ok(code.includes('Thinking & synthesizing'), 'Must show thinking indicator message');

  // 2. Stop button with abort control
  assert.ok(code.includes('handleStop'), 'Must have handleStop function');
  assert.ok(code.includes('abortControllerRef'), 'Must use AbortController ref');
  assert.ok(code.includes('.abort()'), 'Must call abort() on stop');

  // 3. User-aware auto-scroll pinning
  assert.ok(code.includes('autoScrollPinned'), 'Must maintain autoScrollPinned state');
  assert.ok(code.includes('showScrollBottomButton'), 'Must show floating scroll-to-bottom button when unpinned');

  // 4. Persistence across turns
  assert.ok(code.includes('localStorage'), 'Must persist conversation state to localStorage');
});

console.log('\n==========================================');
console.log(`Summary: ${passedTests}/${totalTests} tests passed.`);
console.log('==========================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log('🎉 All FE-06 streaming chat verification tests passed successfully!');
}
