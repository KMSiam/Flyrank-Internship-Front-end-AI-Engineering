import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promptAuditInputSchema, executePromptAudit } from '../src/lib/tools/promptAuditTool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting FE-07 Tool Results & Structured Output Automated Test Suite...\n');

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

// Group 1: Tool Definition File & Schema Validation
console.log('--- 1. Tool Definition & Zod Schema Validation ---');

test('promptAuditTool.js exists and exports schema and execute function', () => {
  const toolFile = path.join(rootDir, 'src/lib/tools/promptAuditTool.js');
  assert.ok(fs.existsSync(toolFile), 'promptAuditTool.js must exist');
  assert.ok(promptAuditInputSchema, 'Must export promptAuditInputSchema');
  assert.ok(typeof executePromptAudit === 'function', 'Must export executePromptAudit function');
});

test('promptAuditInputSchema accepts valid parameters with defaults', () => {
  const result = promptAuditInputSchema.safeParse({
    promptText: 'You are an expert Frontend AI engineer designing accessible components.'
  });
  assert.ok(result.success, 'Valid input should succeed');
  assert.strictEqual(result.data.targetDomain, 'coding');
  assert.strictEqual(result.data.strictMode, true);
});

test('promptAuditInputSchema rejects invalid short inputs (< 5 chars)', () => {
  const result = promptAuditInputSchema.safeParse({
    promptText: 'hi'
  });
  assert.strictEqual(result.success, false);
  assert.ok(result.error.issues.length > 0, 'Should return validation errors');
});

// Group 2: Tool Execution & Return Shape
console.log('\n--- 2. Tool Execution & Output Return Shape ---');

await asyncTest('executePromptAudit produces structured metrics component data', async () => {
  const output = await executePromptAudit({
    promptText: 'Analyze frontend streaming latency step-by-step and strictly avoid conversational filler.',
    targetDomain: 'coding',
    strictMode: true
  });

  assert.strictEqual(output.success, true);
  assert.strictEqual(output.toolName, 'scorePromptEngineering');
  assert.ok(output.overallScore >= 0 && output.overallScore <= 100);
  assert.ok(['EXCELLENT', 'GOOD', 'MODERATE', 'NEEDS_WORK'].includes(output.gradeTier));
  assert.ok(output.dimensions, 'Dimensions object must exist');
  assert.ok(output.dimensions.clarity >= 0);
  assert.ok(output.dimensions.specificity >= 0);
  assert.ok(output.dimensions.guardrails >= 0);
  assert.ok(Array.isArray(output.recommendations), 'Recommendations must be an array');
});

// Group 3: Designed Error State Recovery
console.log('\n--- 3. Designed Error State Handling (No Crash) ---');

await asyncTest('Triggering deliberate tool error produces designed error with code', async () => {
  try {
    await executePromptAudit({
      promptText: 'TRIGGER_TOOL_ERROR: test designed error boundary'
    });
    assert.fail('Should have thrown designed error');
  } catch (err) {
    assert.strictEqual(err.code, 'ERR_INSUFFICIENT_CONTEXT');
    assert.strictEqual(err.status, 'failed');
    assert.ok(err.suggestedAction, 'Must supply suggested action for remediation');
  }
});

// Group 4: UI Tool Part State Machine Verification
console.log('\n--- 4. UI Tool Part 4-State Lifecycle Audit ---');

test('ToolPartRenderer.jsx implements all 4 distinct visual states', () => {
  const rendererPath = path.join(rootDir, 'src/components/tools/ToolPartRenderer.jsx');
  const code = fs.readFileSync(rendererPath, 'utf8');

  assert.ok(code.includes("state === 'input-streaming'"), 'Must handle input-streaming state');
  assert.ok(code.includes("state === 'input-available'"), 'Must handle input-available state');
  assert.ok(code.includes("state === 'output-available'"), 'Must handle output-available state');
  assert.ok(code.includes("state === 'output-error'"), 'Must handle output-error state');
  assert.ok(code.includes('PromptScoreCard'), 'Must render PromptScoreCard component');
  assert.ok(code.includes('ToolErrorCard'), 'Must render ToolErrorCard component');
});

console.log('\n==========================================');
console.log(`Summary: ${passedTests}/${totalTests} tests passed.`);
console.log('==========================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log('🎉 All FE-07 tool results and structured UI tests passed successfully!');
}
