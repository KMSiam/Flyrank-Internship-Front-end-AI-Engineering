import React from 'react';
import { renderToString } from 'react-dom/server';
import { AISettingsForm } from './components/AISettingsForm.js';

console.log('===============================================================');
console.log('ROUND 1: VAGUE PROMPT OUTPUT VERIFICATION RUNNER');
console.log('Prompt: "build a settings form for my ai app"');
console.log('===============================================================');

// 1. Verify component renders to HTML
const html = renderToString(React.createElement(AISettingsForm));
console.log('✔ Component rendered successfully to HTML string (%d bytes)', html.length);

// 2. Demonstrate Round 1 bugs and lack of schema validation
console.log('\n--- Auditing Round 1 Edge Cases & Accessibility ---');

// Bug 1: Label association
const hasHtmlFor = html.includes('for=') || html.includes('htmlFor=');
console.log('[Accessibility] Labels have htmlFor associations:', hasHtmlFor ? 'YES' : 'NO (FAILED - Screen readers cannot bind labels)');

// Bug 2: ARIA error binding
const hasAriaDescribedBy = html.includes('aria-describedby');
console.log('[Accessibility] Error states bound via aria-describedby:', hasAriaDescribedBy ? 'YES' : 'NO (FAILED - No ARIA attributes)');

// Bug 3: Temperature bounds check simulation
function simulateRound1Submit(data) {
  if (!data.apiKey) return { success: false, error: 'API key is required' };
  if (!data.systemPrompt) return { success: false, error: 'System prompt is required' };
  return { success: true, payload: data };
}

// Edge case 1: Whitespace system prompt
const whitespaceResult = simulateRound1Submit({
  apiKey: 'any_string',
  systemPrompt: '      ', // whitespace only
  temperature: -2.5,
  webhookUrl: 'not_a_valid_url'
});
console.log('[Edge Case 1] Whitespace-only system prompt rejected?:', !whitespaceResult.success ? 'YES' : 'NO (FAILED - Accepted blank spaces)');
console.log('[Edge Case 2] Negative temperature rejected?:', whitespaceResult.payload.temperature >= 0 ? 'YES' : 'NO (FAILED - Accepted -2.5)');
console.log('[Edge Case 3] Invalid webhook URL rejected?:', whitespaceResult.payload.webhookUrl.startsWith('http') ? 'YES' : 'NO (FAILED - Accepted invalid string)');

console.log('\nVerdict: Round 1 runs, but suffers from severe accessibility gaps and zero schema validation.');
console.log('===============================================================');
