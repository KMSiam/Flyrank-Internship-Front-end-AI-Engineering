import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { POST } from '../src/app/api/chat/route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting FE-08 Error States, Empty States & Sabotage Automated Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    process.exitCode = 1;
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    process.exitCode = 1;
  }
}

// --- 1. Empty & Invalid Input Validation ---
console.log('--- 1. Empty Input & Validation Edge Cases ---');

await runAsyncTest('POST /api/chat rejects empty or whitespace input with HTTP 400', async () => {
  const req = new Request('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: '   ' }]
    })
  });

  const res = await POST(req);
  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.code, 'ERR_EMPTY_INPUT');
});

// --- 2. Sabotage Mode 1: 429 Rate Limit ---
console.log('\n--- 2. Sabotage Drill: 429 Rate Limit Simulation ---');

await runAsyncTest('POST /api/chat returns HTTP 429 with retry header when rate-limit sabotage triggered', async () => {
  const req = new Request('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-sabotage-scenario': 'ratelimit'
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Audit my prompt' }]
    })
  });

  const res = await POST(req);
  assert.strictEqual(res.status, 429);
  assert.strictEqual(res.headers.get('Retry-After'), '15');
  const data = await res.json();
  assert.strictEqual(data.code, 'ERR_RATE_LIMIT_429');
});

// --- 3. Sabotage Mode 2: Network / Provider Outage (503) ---
console.log('\n--- 3. Sabotage Drill: 503 Provider Outage ---');

await runAsyncTest('POST /api/chat returns HTTP 503 on network sabotage', async () => {
  const req = new Request('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-sabotage-scenario': 'network'
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Test network drop' }]
    })
  });

  const res = await POST(req);
  assert.strictEqual(res.status, 503);
  const data = await res.json();
  assert.strictEqual(data.code, 'ERR_NETWORK_UNREACHABLE');
});

// --- 4. Sabotage Mode 3: Mid-Stream Server Interruption ---
console.log('\n--- 4. Sabotage Drill: Mid-Stream Failure Event ---');

await runAsyncTest('POST /api/chat emits text-delta then sends error event mid-stream', async () => {
  const req = new Request('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-sabotage-scenario': 'midstream'
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'TRIGGER_MIDSTREAM_ERROR' }]
    })
  });

  const res = await POST(req);
  assert.strictEqual(res.status, 200);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullStream = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    fullStream += decoder.decode(value);
  }

  // Must have emitted at least one text-delta before failing
  assert.ok(fullStream.includes('text-delta'), 'Should emit initial text tokens');
  // Must contain structured error payload
  assert.ok(fullStream.includes('ERR_MIDSTREAM_DROP'), 'Should emit ERR_MIDSTREAM_DROP');
});

// --- 5. Route Error Boundaries (error.jsx, chat/error.jsx, not-found.jsx) ---
console.log('\n--- 5. App Router Error & Empty State Boundaries ---');

runTest('Global error boundary src/app/error.jsx exists with reset action', () => {
  const filePath = path.join(rootDir, 'src/app/error.jsx');
  assert.ok(fs.existsSync(filePath), 'src/app/error.jsx must exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert.ok(content.includes('reset'), 'Must accept reset callback');
  assert.ok(content.includes('use client'), 'Must be a Client Component');
});

runTest('Chat route error boundary src/app/chat/error.jsx exists', () => {
  const filePath = path.join(rootDir, 'src/app/chat/error.jsx');
  assert.ok(fs.existsSync(filePath), 'src/app/chat/error.jsx must exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert.ok(content.includes('reset'), 'Must accept reset callback');
  assert.ok(content.includes('use client'), 'Must be a Client Component');
});

runTest('Designed 404 page src/app/not-found.jsx exists', () => {
  const filePath = path.join(rootDir, 'src/app/not-found.jsx');
  assert.ok(fs.existsSync(filePath), 'src/app/not-found.jsx must exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert.ok(content.includes('HTTP 404'), 'Must communicate 404 status');
  assert.ok(content.includes('href="/"'), 'Must provide navigation home');
});

// --- 6. Component UX: Designed Empty State, Retry, Skeletons ---
console.log('\n--- 6. Component UX & Buttons with a Brain ---');

runTest('StreamingChat.jsx implements designed empty state with starter prompt cards', () => {
  const filePath = path.join(rootDir, 'src/components/chat/StreamingChat.jsx');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert.ok(content.includes('STARTER_PROMPTS'), 'Must define actionable starter prompts');
  assert.ok(content.includes('Designed empty state'), 'Must implement designed empty state');
  assert.ok(content.includes('messages.length === 0'), 'Must render empty state when no messages');
});

runTest('StreamingChat.jsx implements layout-accurate skeleton to prevent CLS', () => {
  const filePath = path.join(rootDir, 'src/components/chat/StreamingChat.jsx');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert.ok(content.includes('LAYOUT-ACCURATE SKELETON'), 'Must implement layout-accurate skeleton');
  assert.ok(content.includes('showThinking'), 'Must trigger skeleton during thinking state');
});

runTest('StreamingChat.jsx implements micro-interaction retry button targeting failed turn', () => {
  const filePath = path.join(rootDir, 'src/components/chat/StreamingChat.jsx');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert.ok(content.includes('handleRetry'), 'Must implement handleRetry function');
  assert.ok(content.includes('retryingMessageId'), 'Must debounce retry against double clicks');
  assert.ok(content.includes('Retry this response'), 'Must display clear retry label');
});

console.log('\n==========================================');
console.log(`Summary: ${passedTests}/${totalTests} tests passed.`);
console.log('==========================================\n');

if (passedTests === totalTests) {
  console.log('🎉 All FE-08 error states, empty states & sabotage tests passed successfully!');
} else {
  process.exit(1);
}
