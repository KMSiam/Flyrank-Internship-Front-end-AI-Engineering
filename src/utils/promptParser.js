/**
 * Prompt parser utilities for extracting {{variables}}, interpolating values,
 * and estimating token consumption and USD cost.
 */

const VARIABLE_REGEX = /\{\{([a-zA-Z0-9_\-]+)\}\}/g;

/**
 * Extracts unique variable names from prompt template text.
 * @param {string} templateText 
 * @returns {string[]}
 */
export function extractVariables(templateText) {
  if (!templateText || typeof templateText !== 'string') return [];
  const matches = new Set();
  let match;
  while ((match = VARIABLE_REGEX.exec(templateText)) !== null) {
    if (match[1]) {
      matches.add(match[1]);
    }
  }
  return Array.from(matches);
}

/**
 * Replaces {{variable}} placeholders with provided values.
 * Preserves the placeholder if no value is provided.
 * @param {string} templateText 
 * @param {Record<string, string>} valuesMap 
 * @returns {string}
 */
export function interpolatePrompt(templateText, valuesMap = {}) {
  if (!templateText || typeof templateText !== 'string') return '';
  return templateText.replace(VARIABLE_REGEX, (fullMatch, varName) => {
    if (valuesMap[varName] !== undefined && valuesMap[varName] !== '') {
      return valuesMap[varName];
    }
    return fullMatch;
  });
}

/**
 * Estimates token count using standard ~4 chars/token heuristic.
 * @param {string} text 
 * @returns {number}
 */
export function estimateTokens(text) {
  if (!text) return 0;
  // Approximately 4 characters per token for English text
  return Math.max(1, Math.ceil(text.length / 4));
}

/**
 * Model pricing tier rates per 1,000,000 tokens (USD)
 */
export const MODEL_PRICING = {
  'gemini-3.8-flash': {
    name: 'Gemini 3.8 Flash High (Primary)',
    provider: 'Google Antigravity',
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60
  },
  'claude-3-7-sonnet': {
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00
  },
  'gpt-4o': {
    name: 'GPT-4o',
    provider: 'OpenAI',
    inputCostPer1M: 2.50,
    outputCostPer1M: 10.00
  }
};

/**
 * Calculates estimated cost in USD.
 * @param {number} promptTokens 
 * @param {number} completionTokens 
 * @param {string} modelId 
 * @returns {number}
 */
export function calculateEstimatedCost(promptTokens, completionTokens, modelId = 'gemini-3.8-flash') {
  const model = MODEL_PRICING[modelId] || MODEL_PRICING['gemini-3.8-flash'];
  const inputCost = (promptTokens / 1_000_000) * model.inputCostPer1M;
  const outputCost = (completionTokens / 1_000_000) * model.outputCostPer1M;
  return Number((inputCost + outputCost).toFixed(6));
}
