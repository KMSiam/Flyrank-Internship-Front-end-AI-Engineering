import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GET as healthHandler } from '../src/app/api/health/route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting FE-04 Capstone Skeleton & Routed Pages Automated Test Suite...\n');

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

// Group 1: Routed Pages Existence in Specification
console.log('--- 1. Routed Pages Existence in Spec ---');

const REQUIRED_ROUTES = [
  { path: 'src/app/page.jsx', name: 'Root Dashboard / Overview (/)' },
  { path: 'src/app/chat/page.jsx', name: 'Streaming Chat Studio (/chat)' },
  { path: 'src/app/generative-ui/page.jsx', name: 'Generative UI Sandbox (/generative-ui)' },
  { path: 'src/app/multimodal/page.jsx', name: 'Multimodal Vision & Canvas (/multimodal)' },
  { path: 'src/app/workflows/page.jsx', name: 'Visual Workflow Studio (/workflows)' },
  { path: 'src/app/finops/page.jsx', name: 'LLM Token FinOps (/finops)' },
  { path: 'src/app/settings/page.jsx', name: 'AI Settings Form (/settings)' },
  { path: 'src/app/health/page.jsx', name: 'Health-Check Live Page (/health)' },
  { path: 'src/app/api/health/route.js', name: 'Health API Handler (/api/health)' },
];

REQUIRED_ROUTES.forEach(route => {
  test(`Route file exists for ${route.name}`, () => {
    const fullPath = path.join(rootDir, route.path);
    assert.ok(fs.existsSync(fullPath), `Missing required route file: ${route.path}`);
  });
});

// Group 2: Health API Route Execution
console.log('\n--- 2. Health Check API Diagnostic & Contract ---');

await asyncTest('GET /api/health returns 200 with healthy status and check matrix', async () => {
  const response = await healthHandler();
  assert.strictEqual(response.status, 200);
  
  const body = await response.json();
  assert.strictEqual(body.status, 'healthy');
  assert.ok(body.uptimeSeconds >= 0, 'Uptime must be non-negative');
  assert.ok(body.checks, 'Checks object must exist');
  assert.strictEqual(body.checks.serverComponents.status, 'pass');
  assert.strictEqual(body.checks.clientInteractivity.status, 'pass');
  assert.strictEqual(body.checks.tailwindDesignTokens.status, 'pass');
  assert.strictEqual(body.checks.envVariableIntegrity.status, 'pass');
});

// Group 3: Design Tokens & Tailwind Configuration
console.log('\n--- 3. Base Design Tokens & Responsiveness ---');

test('tailwind.config.mjs defines required 375px mobile and 1280px desktop screens', () => {
  const tailwindPath = path.join(rootDir, 'tailwind.config.mjs');
  const content = fs.readFileSync(tailwindPath, 'utf8');
  assert.ok(content.includes('375px'), 'Must include 375px mobile breakpoint');
  assert.ok(content.includes('1280px'), 'Must include 1280px desktop breakpoint');
  assert.ok(content.includes('background:'), 'Must include custom background token');
  assert.ok(content.includes('primary:'), 'Must include custom primary token');
});

test('globals.css imports tailwind base, components, and utilities', () => {
  const cssPath = path.join(rootDir, 'src/app/globals.css');
  const content = fs.readFileSync(cssPath, 'utf8');
  assert.ok(content.includes('@tailwind base'), 'Missing @tailwind base');
  assert.ok(content.includes('@tailwind components'), 'Missing @tailwind components');
  assert.ok(content.includes('@tailwind utilities'), 'Missing @tailwind utilities');
});

// Group 4: Environment Variables & Zero Secrets Invariant
console.log('\n--- 4. Environment Variables Structure & Secret Protection ---');

test('.env.example exists with placeholder values and no committed real secrets', () => {
  const envExamplePath = path.join(rootDir, '.env.example');
  assert.ok(fs.existsSync(envExamplePath), '.env.example must exist');
  
  const content = fs.readFileSync(envExamplePath, 'utf8');
  assert.ok(content.includes('NEXT_PUBLIC_APP_URL'), 'Must contain NEXT_PUBLIC_APP_URL');
  assert.ok(!content.includes('sk-antigravity-live-real'), 'Must not contain real production keys');
});

test('.gitignore strictly ignores all .env and local secret variants', () => {
  const gitignorePath = path.join(rootDir, '.gitignore');
  const content = fs.readFileSync(gitignorePath, 'utf8');
  assert.ok(content.includes('.env'), '.gitignore must ignore .env');
  assert.ok(content.includes('.env*.local'), '.gitignore must ignore .env*.local');
});

console.log('\n==========================================');
console.log(`Summary: ${passedTests}/${totalTests} tests passed.`);
console.log('==========================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log('🎉 All FE-04 route and skeleton verification tests passed successfully!');
}
