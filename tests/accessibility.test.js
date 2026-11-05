import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting FE-05 Accessible Components & A11y Verification Suite...\n');

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

// Group 1: Component Files & Zero Component Libraries
console.log('--- 1. Playground Component Files & TypeScript Implementation ---');

const REQUIRED_FILES = [
  'playground/Modal.tsx',
  'playground/Tabs.tsx',
  'playground/Disclosure.tsx',
  'playground/index.tsx',
  'NOTES.md'
];

REQUIRED_FILES.forEach(relPath => {
  test(`File exists: ${relPath}`, () => {
    const fullPath = path.join(rootDir, relPath);
    assert.ok(fs.existsSync(fullPath), `Missing required file: ${relPath}`);
  });
});

// Group 2: Modal W3C APG Pattern
console.log('\n--- 2. Modal Dialog Pattern & Focus Trapping ---');

test('Modal.tsx implements role="dialog", aria-modal="true", and Escape key handler', () => {
  const modalPath = path.join(rootDir, 'playground/Modal.tsx');
  const code = fs.readFileSync(modalPath, 'utf8');
  assert.ok(code.includes('role="dialog"'), 'Must have role="dialog"');
  assert.ok(code.includes('aria-modal="true"'), 'Must have aria-modal="true"');
  assert.ok(code.includes("key === 'Escape'"), 'Must handle Escape key');
  assert.ok(code.includes("key === 'Tab'"), 'Must trap Tab key');
  assert.ok(code.includes('previousActiveElementRef'), 'Must save and restore previous active element');
});

// Group 3: Tabs W3C APG Pattern
console.log('\n--- 3. Tabs Widget Pattern & Roving Tabindex ---');

test('Tabs.tsx implements role="tablist", role="tab", role="tabpanel", and roving tabindex', () => {
  const tabsPath = path.join(rootDir, 'playground/Tabs.tsx');
  const code = fs.readFileSync(tabsPath, 'utf8');
  assert.ok(code.includes('role="tablist"'), 'Must have role="tablist"');
  assert.ok(code.includes('role="tab"'), 'Must have role="tab"');
  assert.ok(code.includes('role="tabpanel"'), 'Must have role="tabpanel"');
  assert.ok(code.includes('aria-selected='), 'Must have aria-selected attribute');
  assert.ok(code.includes('aria-controls='), 'Must have aria-controls attribute');
  assert.ok(code.includes('ArrowRight'), 'Must support ArrowRight navigation');
  assert.ok(code.includes('ArrowLeft'), 'Must support ArrowLeft navigation');
  assert.ok(code.includes('Home') && code.includes('End'), 'Must support Home/End navigation');
  assert.ok(code.includes('tabIndex={isSelected ? 0 : -1}'), 'Must implement roving tabindex');
});

// Group 4: Disclosure W3C APG Pattern
console.log('\n--- 4. Disclosure Widget Pattern ---');

test('Disclosure.tsx implements button with aria-expanded, aria-controls, and role="region"', () => {
  const discPath = path.join(rootDir, 'playground/Disclosure.tsx');
  const code = fs.readFileSync(discPath, 'utf8');
  assert.ok(code.includes('aria-expanded='), 'Must have aria-expanded attribute');
  assert.ok(code.includes('aria-controls='), 'Must have aria-controls attribute');
  assert.ok(code.includes('role="region"'), 'Must have role="region"');
  assert.ok(code.includes('aria-labelledby='), 'Must have aria-labelledby linkage');
});

// Group 5: Zero 'any' Escapes Audit
console.log('\n--- 5. TypeScript Strict Typing Audit ---');

test('No "any" type escapes in component props interfaces', () => {
  ['playground/Modal.tsx', 'playground/Tabs.tsx', 'playground/Disclosure.tsx'].forEach(file => {
    const fullPath = path.join(rootDir, file);
    const code = fs.readFileSync(fullPath, 'utf8');
    // Ensure no ': any' in interface definitions
    const interfaceMatch = code.match(/interface\s+\w+Props\s*\{[^}]*\}/g);
    if (interfaceMatch) {
      interfaceMatch.forEach(block => {
        assert.ok(!block.includes(': any'), `Found forbidden 'any' escape in ${file}: ${block}`);
      });
    }
  });
});

// Group 6: NOTES.md Depth & Concrete Gaps
console.log('\n--- 6. NOTES.md Concrete Gaps Analysis ---');

test('NOTES.md documents at least two concrete gaps between custom components and shadcn/ui', () => {
  const notesPath = path.join(rootDir, 'NOTES.md');
  const content = fs.readFileSync(notesPath, 'utf8');
  assert.ok(content.includes('Portal Rendering'), 'Must document Portal rendering gap');
  assert.ok(content.includes('Scroll Locking') || content.includes('Layout Shift'), 'Must document scroll locking gap');
  assert.ok(content.includes('aria-hidden') || content.includes('inert'), 'Must document screen reader sibling inerting');
});

console.log('\n==========================================');
console.log(`Summary: ${passedTests}/${totalTests} tests passed.`);
console.log('==========================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log('🎉 All FE-05 accessibility verification tests passed successfully!');
}
