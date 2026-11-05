import assert from 'node:assert';
import {
  extractVariables,
  interpolatePrompt,
  estimateTokens,
  calculateEstimatedCost,
  MODEL_PRICING
} from '../src/utils/promptParser.js';
import { evaluatePromptQuality } from '../src/utils/evaluator.js';
import { DEFAULT_TEMPLATES } from '../src/data/defaultTemplates.js';

console.log('🧪 Starting PromptCraft Studio AI Automated Test Suite...\n');

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

// Group 1: Variable Extraction & Interpolation
console.log('--- 1. Variable Extraction & Template Interpolation ---');

test('extractVariables extracts multiple unique curly-brace placeholders', () => {
  const template = 'Analyze {{input_data}} with context {{context_window}} and return {{input_data}} as {{format}}.';
  const vars = extractVariables(template);
  assert.deepStrictEqual(vars, ['input_data', 'context_window', 'format']);
});

test('extractVariables handles empty strings and prompts without placeholders', () => {
  assert.deepStrictEqual(extractVariables(''), []);
  assert.deepStrictEqual(extractVariables('A static prompt with no curly braces'), []);
  assert.deepStrictEqual(extractVariables(null), []);
});

test('interpolatePrompt replaces matched variables and preserves unmatched ones', () => {
  const template = 'Hello {{name}}, welcome to {{service}}!';
  const vars = { name: 'Siam', service: 'FlyRank' };
  const result = interpolatePrompt(template, vars);
  assert.strictEqual(result, 'Hello Siam, welcome to FlyRank!');
});

test('interpolatePrompt keeps placeholder if variable key is missing', () => {
  const template = 'Target: {{target}}, Mode: {{mode}}';
  const vars = { target: 'Production' };
  const result = interpolatePrompt(template, vars);
  assert.strictEqual(result, 'Target: Production, Mode: {{mode}}');
});

// Group 2: Token Estimation & FinOps Pricing
console.log('\n--- 2. Token Estimation & FinOps Cost Calculation ---');

test('estimateTokens calculates approximate token counts accurately', () => {
  const text = 'You are an expert AI prompt engineer optimizing system instructions for low latency.';
  const tokens = estimateTokens(text);
  assert.ok(tokens > 10 && tokens < 25, `Expected tokens between 10 and 25, got ${tokens}`);
});

test('estimateTokens handles null and empty text gracefully', () => {
  assert.strictEqual(estimateTokens(''), 0);
  assert.strictEqual(estimateTokens(null), 0);
});

test('calculateEstimatedCost computes accurate USD costs across models', () => {
  const promptTokens = 1000;
  const completionTokens = 500;

  // Gemini 3.8 Flash High ($0.15 / $0.60 per 1M tokens)
  const geminiCost = calculateEstimatedCost(promptTokens, completionTokens, 'gemini-3.8-flash');
  const expectedGemini = (1000 / 1_000_000 * 0.15) + (500 / 1_000_000 * 0.60);
  assert.strictEqual(geminiCost, Number(expectedGemini.toFixed(6)));

  // Claude 3.7 Sonnet ($3.00 / $15.00 per 1M tokens)
  const claudeCost = calculateEstimatedCost(promptTokens, completionTokens, 'claude-3-7-sonnet');
  const expectedClaude = (1000 / 1_000_000 * 3.00) + (500 / 1_000_000 * 15.00);
  assert.strictEqual(claudeCost, Number(expectedClaude.toFixed(6)));
  assert.ok(claudeCost > geminiCost, 'Claude 3.7 Sonnet should cost more than Gemini 3.8 Flash');
});

// Group 3: Heuristic Quality Scorecard Evaluator
console.log('\n--- 3. Static Quality Evaluation Heuristics ---');

test('evaluatePromptQuality assigns high scores to well-structured prompts', () => {
  const prompt = `You are a Senior Full-Stack Architect.
Task: Analyze the architecture specifications step-by-step.
Context: {{system_spec}}
Output format: Return strictly valid JSON adhering to the provided schema.
Never emit conversational filler or markdown code fences outside JSON.`;

  const evaluation = evaluatePromptQuality(prompt, ['system_spec']);
  assert.ok(evaluation.overallScore >= 80, `Expected overall score >= 80, got ${evaluation.overallScore}`);
  assert.strictEqual(evaluation.qualityTier, 'EXCELLENT');
  assert.ok(evaluation.clarityScore >= 80, 'Clarity score should be >= 80');
  assert.ok(evaluation.specificityScore >= 70, 'Specificity score should be >= 70');
  assert.ok(evaluation.constraintScore >= 80, 'Constraint score should be >= 80');
});

test('evaluatePromptQuality identifies weak prompts and provides actionable suggestions', () => {
  const weakPrompt = 'fix my code please';
  const evaluation = evaluatePromptQuality(weakPrompt, []);
  assert.ok(evaluation.overallScore < 50, `Expected weak score < 50, got ${evaluation.overallScore}`);
  assert.strictEqual(evaluation.qualityTier, 'POOR');
  assert.ok(evaluation.suggestions.length > 0, 'Should return actionable suggestions');
});

// Group 4: Default Templates Integrity
console.log('\n--- 4. Pre-seeded Domain Templates Integrity ---');

test('all default templates have valid schema and structure', () => {
  assert.ok(DEFAULT_TEMPLATES.length >= 4, 'Should contain at least 4 pre-seeded templates');
  
  DEFAULT_TEMPLATES.forEach(tmpl => {
    assert.ok(tmpl.id, 'Template must have an id');
    assert.ok(tmpl.title, 'Template must have a title');
    assert.ok(tmpl.category, 'Template must have a category');
    assert.ok(tmpl.systemRole, 'Template must have a systemRole');
    assert.ok(tmpl.templateText, 'Template must have templateText');
    assert.ok(Array.isArray(tmpl.tags), 'Template tags must be an array');
    
    // Check that every variable extracted has a corresponding default variable
    const extracted = extractVariables(tmpl.templateText);
    extracted.forEach(v => {
      assert.ok(
        tmpl.defaultVariables && tmpl.defaultVariables[v] !== undefined,
        `Template "${tmpl.title}" missing default variable for "${v}"`
      );
    });
  });
});

console.log('\n==========================================');
console.log(`Summary: ${passedTests}/${totalTests} tests passed.`);
console.log('==========================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log('🎉 All automated tests passed successfully!');
}
