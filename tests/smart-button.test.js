import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting FE-AA1 Buttons with a Brain Automated Test Suite...\n');

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

// 1. Component File Existence & State Implementation
console.log('--- 1. SmartButton Component Invariants ---');

runTest('SmartButton.jsx exists and defines required states', () => {
  const filePath = path.join(rootDir, 'src/components/ui/SmartButton.jsx');
  assert.ok(fs.existsSync(filePath), 'SmartButton.jsx must exist');
  const code = fs.readFileSync(filePath, 'utf-8');

  // Verify at least 5 states: idle, loading, success, error, disabled
  assert.ok(code.includes("'idle'"), 'Must handle idle state');
  assert.ok(code.includes("'loading'"), 'Must handle loading state');
  assert.ok(code.includes("'success'"), 'Must handle success state');
  assert.ok(code.includes("'error'"), 'Must handle error state');
  assert.ok(code.includes('disabled'), 'Must handle disabled state');
});

runTest('SmartButton.jsx animates only compositor-friendly properties (transform, opacity)', () => {
  const filePath = path.join(rootDir, 'src/components/ui/SmartButton.jsx');
  const code = fs.readFileSync(filePath, 'utf-8');

  assert.ok(code.includes('transform'), 'Must use transform');
  assert.ok(code.includes('opacity'), 'Must use opacity');
  assert.ok(code.includes('scale'), 'Must use scale for tactile feedback');
});

runTest('SmartButton.jsx honors prefers-reduced-motion', () => {
  const filePath = path.join(rootDir, 'src/components/ui/SmartButton.jsx');
  const code = fs.readFileSync(filePath, 'utf-8');

  assert.ok(code.includes('motion-reduce:transform-none'), 'Must disable transforms on reduced motion');
  assert.ok(code.includes('motion-reduce:animate-none'), 'Must disable animations on reduced motion');
});

runTest('SmartButton.jsx implements keyboard accessibility & ARIA live region', () => {
  const filePath = path.join(rootDir, 'src/components/ui/SmartButton.jsx');
  const code = fs.readFileSync(filePath, 'utf-8');

  assert.ok(code.includes('focus-visible:ring'), 'Must have visible focus ring');
  assert.ok(code.includes('aria-live="polite"'), 'Must announce state politely to screen readers');
  assert.ok(code.includes('aria-busy'), 'Must set aria-busy during loading state');
});

// 2. Demo Page & System Flex Invariants
console.log('\n--- 2. Interactive Demo Page & Motion Grammar ---');

runTest('micro-interactions/page.jsx exists and mounts both primary and secondary buttons', () => {
  const filePath = path.join(rootDir, 'src/app/micro-interactions/page.jsx');
  assert.ok(fs.existsSync(filePath), 'micro-interactions/page.jsx must exist');
  const code = fs.readFileSync(filePath, 'utf-8');

  assert.ok(code.includes('SmartButton'), 'Must render SmartButton');
  assert.ok(code.includes('variant="primary"'), 'Must render primary button');
  assert.ok(code.includes('variant="secondary"'), 'Must render secondary button');
  assert.ok(code.includes('Force Success'), 'Must include forced success trigger');
  assert.ok(code.includes('Force Error'), 'Must include forced error trigger');
});

runTest('globals.css defines physics-based keyframe shake for error state', () => {
  const filePath = path.join(rootDir, 'src/app/globals.css');
  const code = fs.readFileSync(filePath, 'utf-8');

  assert.ok(code.includes('@keyframes buttonShake'), 'Must define buttonShake keyframe');
  assert.ok(code.includes('cubic-bezier'), 'Must use physics-based easing curve');
});

console.log('\n==========================================');
console.log(`Summary: ${passedTests}/${totalTests} tests passed.`);
console.log('==========================================\n');

if (passedTests === totalTests) {
  console.log('🎉 All FE-AA1 Buttons with a Brain tests passed successfully!');
} else {
  process.exit(1);
}
