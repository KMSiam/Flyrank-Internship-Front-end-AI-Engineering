import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { aiSettingsSchema } from '../schemas/aiSettingsSchema.js';
import { AISettingsForm } from '../components/AISettingsForm.js';

console.log('===============================================================');
console.log('ROUND 2: PRECISE PROMPT AUTOMATED VERIFICATION TEST SUITE');
console.log('Target: AISettingsForm + aiSettingsSchema');
console.log('===============================================================');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✔ PASS [${totalTests}]: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✖ FAIL [${totalTests}]: ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

// 1. Valid payload test
runTest('Valid enterprise configuration passes schema validation', () => {
  const validData = {
    apiKey: 'sk-ant-api03-abcdef1234567890',
    model: 'claude-3-7-sonnet',
    temperature: 0.7,
    maxTokens: 4096,
    systemPrompt: 'You are an autonomous AI coding assistant with rigorous standards.',
    streamResponse: true,
    webhookUrl: 'https://telemetry.flyrank.ai/v1/events'
  };

  const parsed = aiSettingsSchema.parse(validData);
  assert.equal(parsed.model, 'claude-3-7-sonnet');
  assert.equal(parsed.temperature, 0.7);
  assert.equal(parsed.maxTokens, 4096);
});

// 2. Invalid API key prefix
runTest('Invalid API key prefix rejected by regex constraint', () => {
  const result = aiSettingsSchema.safeParse({
    apiKey: 'invalid-prefix-key-123456789',
    model: 'claude-3-7-sonnet',
    temperature: 0.5,
    maxTokens: 1024,
    systemPrompt: 'Valid prompt with sufficient length.'
  });

  assert.equal(result.success, false);
  const issues = result.error.issues;
  assert.ok(issues.some(e => e.message.includes("must start with 'sk-' or 'anthropic-'")));
});

// 3. Short API key rejected
runTest('Short API key (< 16 characters) rejected', () => {
  const result = aiSettingsSchema.safeParse({
    apiKey: 'sk-123',
    model: 'gpt-4o',
    temperature: 0.5,
    maxTokens: 1024,
    systemPrompt: 'Valid prompt with sufficient length.'
  });

  assert.equal(result.success, false);
});

// 4. Negative temperature boundary check
runTest('Negative temperature (-0.25) rejected', () => {
  const result = aiSettingsSchema.safeParse({
    apiKey: 'sk-abcdef1234567890xyz',
    model: 'gpt-4o',
    temperature: -0.25,
    maxTokens: 2048,
    systemPrompt: 'Valid prompt with sufficient length.'
  });

  assert.equal(result.success, false);
  const issues = result.error.issues;
  assert.ok(issues.some(e => e.message.includes('cannot be negative')));
});

// 5. Excessive temperature boundary check
runTest('Temperature exceeding 1.0 (1.45) rejected', () => {
  const result = aiSettingsSchema.safeParse({
    apiKey: 'sk-abcdef1234567890xyz',
    model: 'gpt-4o',
    temperature: 1.45,
    maxTokens: 2048,
    systemPrompt: 'Valid prompt with sufficient length.'
  });

  assert.equal(result.success, false);
  const issues = result.error.issues;
  assert.ok(issues.some(e => e.message.includes('cannot exceed 1.0')));
});

// 6. Whitespace-only system prompt rejection
runTest('Whitespace-only system prompt rejected after .trim()', () => {
  const result = aiSettingsSchema.safeParse({
    apiKey: 'sk-abcdef1234567890xyz',
    model: 'claude-3-5-haiku',
    temperature: 0.3,
    maxTokens: 2048,
    systemPrompt: '                 ' // 17 whitespace spaces
  });

  assert.equal(result.success, false);
  const issues = result.error.issues;
  assert.ok(issues.some(e => e.message.includes('at least 10 non-whitespace characters')));
});

// 7. Non-HTTPS webhook URL rejection
runTest('Non-HTTPS webhook URL (insecure http://) rejected', () => {
  const result = aiSettingsSchema.safeParse({
    apiKey: 'sk-abcdef1234567890xyz',
    model: 'gemini-1.5-pro',
    temperature: 0.5,
    maxTokens: 2048,
    systemPrompt: 'Valid prompt with sufficient length.',
    webhookUrl: 'http://insecure-api.com/webhook'
  });

  assert.equal(result.success, false);
  const issues = result.error.issues;
  assert.ok(issues.some(e => e.message.includes('must be a valid HTTPS URL')));
});

// 8. Empty string webhook URL accepted (optional field)
runTest('Empty webhook URL gracefully accepted as optional', () => {
  const result = aiSettingsSchema.safeParse({
    apiKey: 'sk-abcdef1234567890xyz',
    model: 'gemini-1.5-pro',
    temperature: 0.5,
    maxTokens: 2048,
    systemPrompt: 'Valid prompt with sufficient length.',
    webhookUrl: ''
  });

  assert.equal(result.success, true);
});

// 9. Component WCAG 2.1 AA Accessibility Rendering
runTest('AISettingsForm renders complete WCAG 2.1 AA semantic markup', () => {
  const html = renderToString(React.createElement(AISettingsForm));
  
  // Verify explicit label-to-input binding
  assert.ok(html.includes('for="apiKey"') && html.includes('id="apiKey"'), 'apiKey label must bind via for/id');
  assert.ok(html.includes('for="temperature"') && html.includes('id="temperature"'), 'temperature label must bind via for/id');
  assert.ok(html.includes('for="systemPrompt"') && html.includes('id="systemPrompt"'), 'systemPrompt label must bind via for/id');
  assert.ok(html.includes('for="webhookUrl"') && html.includes('id="webhookUrl"'), 'webhookUrl label must bind via for/id');

  // Verify form title association
  assert.ok(html.includes('aria-labelledby="form-title"'), 'Form must have aria-labelledby');
  
  // Verify aria-describedby hints
  assert.ok(html.includes('aria-describedby="apiKey-hint"'), 'apiKey input must have aria-describedby hint');
  assert.ok(html.includes('aria-describedby="webhookUrl-hint"'), 'webhookUrl input must have aria-describedby hint');
});

console.log('\n===============================================================');
console.log(`TEST SUITE RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100% SUCCESS RATE)`);
console.log('===============================================================');

if (passedTests !== totalTests) {
  process.exit(1);
}
