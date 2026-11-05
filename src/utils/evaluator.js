/**
 * Evaluates prompt engineering quality using heuristic static analysis.
 * Scores Clarity, Specificity, and Constraint Guardrails on 0-100 scales.
 */

export function evaluatePromptQuality(promptText = '', variables = []) {
  const text = (promptText || '').toLowerCase();
  const suggestions = [];

  // 1. Clarity Assessment
  let clarityScore = 40;
  const actionVerbs = ['analyze', 'generate', 'extract', 'classify', 'review', 'summarize', 'create', 'build', 'audit'];
  const hasActionVerb = actionVerbs.some(verb => text.includes(verb));
  if (hasActionVerb) clarityScore += 25;
  else suggestions.push('Include a definitive action verb (e.g., "Analyze", "Extract", "Classify") in your objective.');

  if (text.includes('step-by-step') || text.includes('think') || text.includes('reason') || text.includes('process')) {
    clarityScore += 20;
  } else {
    suggestions.push('Instruct the model to reason or think step-by-step for complex logic.');
  }

  if (promptText.length >= 100) clarityScore += 15;
  clarityScore = Math.min(100, clarityScore);

  // 2. Specificity Assessment
  let specificityScore = 30;
  if (text.includes('you are') || text.includes('act as') || text.includes('role:')) {
    specificityScore += 25;
  } else {
    suggestions.push('Define an explicit role or persona (e.g., "You are an expert Frontend AI engineer").');
  }

  if (variables.length > 0) {
    specificityScore += 25; // Dynamic variables boost specificity
  } else {
    suggestions.push('Add dynamic placeholders like {{context}} or {{task}} to make your prompt reusable.');
  }

  if (text.includes('example:') || text.includes('input:') || text.includes('output:')) {
    specificityScore += 20;
  } else {
    suggestions.push('Provide at least one few-shot example showing desired input-output behavior.');
  }
  specificityScore = Math.min(100, specificityScore);

  // 3. Constraints & Guardrails Assessment
  let constraintScore = 20;
  if (text.includes('json') || text.includes('markdown') || text.includes('schema') || text.includes('bullet points')) {
    constraintScore += 30;
  } else {
    suggestions.push('Mandate an explicit output format (e.g., valid JSON schema, Markdown tables).');
  }

  if (text.includes('do not') || text.includes('never') || text.includes('avoid') || text.includes('strictly')) {
    constraintScore += 30;
  } else {
    suggestions.push('Include negative guardrails stating what the model must NOT do.');
  }

  if (text.includes('limit') || text.includes('maximum') || text.includes('words') || text.includes('tokens')) {
    constraintScore += 20;
  }
  constraintScore = Math.min(100, constraintScore);

  // Overall Score (Weighted average)
  const overallScore = Math.round((clarityScore * 0.35) + (specificityScore * 0.35) + (constraintScore * 0.30));

  let qualityTier = 'POOR';
  if (overallScore >= 85) qualityTier = 'EXCELLENT';
  else if (overallScore >= 70) qualityTier = 'GOOD';
  else if (overallScore >= 50) qualityTier = 'MODERATE';

  return {
    overallScore,
    qualityTier,
    clarityScore,
    specificityScore,
    constraintScore,
    suggestions: suggestions.slice(0, 4) // Top 4 suggestions
  };
}
