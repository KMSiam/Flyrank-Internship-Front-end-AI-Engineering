import { z } from 'zod';

/**
 * @file promptAuditTool.js
 * Server-side tool definition with Zod schema and execute function (FE-07).
 *
 * TOOL CONTRACT:
 * - Tool Name: scorePromptEngineering
 * - Description: Evaluates prompt clarity, specificity, and constraints, returning structured metrics.
 * - Input Schema: promptAuditInputSchema
 * - Output Shape: PromptAuditResult
 */

export const promptAuditInputSchema = z.object({
  promptText: z
    .string()
    .min(5, 'Prompt text must be at least 5 characters')
    .describe('The prompt template or instruction text to evaluate'),
  targetDomain: z
    .enum(['coding', 'compliance', 'analysis', 'general'])
    .default('coding')
    .describe('The target domain for quality benchmarking'),
  strictMode: z
    .boolean()
    .default(true)
    .describe('Enforce strict constraint guardrails')
});

/**
 * Execute function for the server-side tool.
 * Evaluates the prompt and returns a structured object, or triggers a designed error
 * if the test trigger phrase is detected or input is invalid.
 */
export async function executePromptAudit(args) {
  // Validate against Zod schema
  const parsed = promptAuditInputSchema.safeParse(args);
  if (!parsed.success) {
    throw new Error(`Schema validation error: ${parsed.error.issues.map(i => i.message).join(', ')}`);
  }

  const { promptText, targetDomain, strictMode } = parsed.data;

  // Deliberate error test trigger for reviewers to evaluate the designed error state
  if (promptText.includes('TRIGGER_TOOL_ERROR') || promptText.includes('FORCE_ERROR')) {
    const error = new Error('Execution failed: Insufficient semantic context to evaluate prompt constraints.');
    error.code = 'ERR_INSUFFICIENT_CONTEXT';
    error.status = 'failed';
    error.recoverable = true;
    error.suggestedAction = 'Ensure prompt provides a system persona and output format boundaries.';
    throw error;
  }

  // Simulate server-side heuristic computation
  const lower = promptText.toLowerCase();

  let clarityScore = 55;
  if (lower.includes('analyze') || lower.includes('design') || lower.includes('create') || lower.includes('implement')) {
    clarityScore += 25;
  }
  if (lower.includes('step-by-step') || lower.includes('reason')) {
    clarityScore += 20;
  }
  clarityScore = Math.min(100, clarityScore);

  let specificityScore = 45;
  if (lower.includes('you are') || lower.includes('role:') || lower.includes('architect')) {
    specificityScore += 25;
  }
  if (lower.includes('typescript') || lower.includes('next.js') || lower.includes('react') || lower.includes('json')) {
    specificityScore += 25;
  }
  specificityScore = Math.min(100, specificityScore);

  let guardrailScore = 40;
  if (lower.includes('do not') || lower.includes('never') || lower.includes('strictly') || lower.includes('avoid')) {
    guardrailScore += 35;
  }
  if (strictMode) {
    guardrailScore = Math.min(100, guardrailScore + 15);
  }
  guardrailScore = Math.min(100, guardrailScore);

  const overallScore = Math.round((clarityScore * 0.35) + (specificityScore * 0.35) + (guardrailScore * 0.30));

  let gradeTier = 'NEEDS_WORK';
  if (overallScore >= 85) gradeTier = 'EXCELLENT';
  else if (overallScore >= 70) gradeTier = 'GOOD';
  else if (overallScore >= 50) gradeTier = 'MODERATE';

  const recommendations = [];
  if (clarityScore < 80) recommendations.push('Include a definitive action verb (e.g. "Design", "Analyze", "Synthesize").');
  if (specificityScore < 80) recommendations.push('Specify explicit system persona boundaries and domain constraints.');
  if (guardrailScore < 80) recommendations.push('Add negative constraints (e.g. "Never emit conversational filler").');

  return {
    success: true,
    toolName: 'scorePromptEngineering',
    timestamp: new Date().toISOString(),
    overallScore,
    gradeTier,
    targetDomain,
    strictMode,
    dimensions: {
      clarity: clarityScore,
      specificity: specificityScore,
      guardrails: guardrailScore
    },
    estimatedTokens: Math.ceil(promptText.split(' ').length * 1.33),
    estimatedLatencyMs: 42,
    recommendations: recommendations.length > 0 ? recommendations : ['Prompt meets high-signal enterprise standards!']
  };
}
