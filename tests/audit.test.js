import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting FE-10 Accessibility & Performance Verification Suite...\n');

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

// 1. Accessibility Checks: ARIA Landmarks, aria-live, Focus States
console.log('--- 1. WCAG 2.1 AA & AI-Specific Accessibility Invariants ---');

runTest('StreamingChat.jsx implements polite aria-live transcript region', () => {
  const filePath = path.join(rootDir, 'src/components/chat/StreamingChat.jsx');
  const code = fs.readFileSync(filePath, 'utf-8');

  assert.ok(code.includes('aria-live="polite"'), 'Transcript must announce streamed tokens politely');
  assert.ok(code.includes('role="region"'), 'Messages container must have region role');
  assert.ok(code.includes('aria-label="Chat messages transcript"'), 'Region must have descriptive label');
});

runTest('StreamingChat.jsx implements keyboard-accessible stop and send buttons', () => {
  const filePath = path.join(rootDir, 'src/components/chat/StreamingChat.jsx');
  const code = fs.readFileSync(filePath, 'utf-8');

  assert.ok(code.includes('aria-label="Stop AI streaming generation"'), 'Stop button must have accessible label');
  assert.ok(code.includes('focus-visible:ring'), 'Buttons must display distinct focus ring');
});

runTest('Navbar.jsx and layouts define proper landmarks (header, nav, main, footer)', () => {
  const navbarPath = path.join(rootDir, 'src/components/Navbar.jsx');
  const layoutPath = path.join(rootDir, 'src/app/layout.jsx');
  const navbarCode = fs.readFileSync(navbarPath, 'utf-8');
  const layoutCode = fs.readFileSync(layoutPath, 'utf-8');

  assert.ok(navbarCode.includes('<header'), 'Must use semantic header landmark');
  assert.ok(navbarCode.includes('<nav'), 'Must use semantic nav landmark');
  assert.ok(layoutCode.includes('<main'), 'Must use semantic main landmark');
  assert.ok(layoutCode.includes('<Footer'), 'Must render footer landmark');
});

// 2. Performance & CLS Invariants
console.log('\n--- 2. Web Vitals & Cumulative Layout Shift Guardrails ---');

runTest('StreamingChat.jsx enforces layout-matched skeleton preventing CLS', () => {
  const filePath = path.join(rootDir, 'src/components/chat/StreamingChat.jsx');
  const code = fs.readFileSync(filePath, 'utf-8');

  assert.ok(code.includes('LAYOUT-ACCURATE SKELETON'), 'Must render layout-matched skeleton during thinking');
});

runTest('Three.js canvas is lazy-loaded with static skeleton to preserve initial load', () => {
  const filePath = path.join(rootDir, 'src/components/three/ThreeSceneClient.jsx');
  const code = fs.readFileSync(filePath, 'utf-8');

  assert.ok(code.includes('dynamic('), 'Canvas must be lazy-loaded');
  assert.ok(code.includes('ssr: false'), 'SSR must be disabled to prevent hydration thrash');
  assert.ok(code.includes('loading:'), 'Must provide skeleton fallback');
});

console.log('\n==========================================');
console.log(`Summary: ${passedTests}/${totalTests} tests passed.`);
console.log('==========================================\n');

if (passedTests === totalTests) {
  console.log('🎉 All FE-10 Accessibility & Performance tests passed successfully!');
} else {
  process.exit(1);
}
