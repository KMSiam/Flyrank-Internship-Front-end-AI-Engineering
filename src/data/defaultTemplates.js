/**
 * Pre-seeded enterprise prompt engineering templates across multiple domains.
 */

export const DEFAULT_TEMPLATES = [
  {
    id: 'tmpl-coding-arch',
    title: 'Full-Stack Feature Architect',
    category: 'Coding',
    tags: ['react', 'nextjs', 'architecture', 'typescript'],
    systemRole: 'You are a principal frontend engineer specializing in Next.js 15 App Router and React 19.',
    templateText: `You are a principal software engineer. Analyze the following requirement and design a production-grade implementation.

Requirement:
{{feature_requirement}}

Target Stack:
- Framework: {{framework}}
- State Management: {{state_solution}}

Strict Constraints:
1. Provide a step-by-step architectural breakdown before code.
2. Ensure strict TypeScript types (never use 'any').
3. Include WCAG 2.1 AA accessibility (proper ARIA attributes and keyboard handlers).
4. Strictly do NOT use unvalidated inline forms; enforce schema validation.

Output Format:
Return your response structured in clean GitHub-Flavored Markdown with code blocks and a verification plan.`,
    defaultVariables: {
      feature_requirement: 'Build a streaming AI chat panel with auto-scroll and abort button',
      framework: 'React 19 with Next.js App Router',
      state_solution: 'Zustand with optimistic UI updates'
    }
  },
  {
    id: 'tmpl-compliance-audit',
    title: 'Regulatory & Contract Clause Auditor',
    category: 'Compliance',
    tags: ['legal', 'gdpr', 'risk-analysis', 'audit'],
    systemRole: 'You are an autonomous corporate compliance auditor evaluating commercial vendor agreements.',
    templateText: `You are an expert corporate legal auditor. Perform a rigorous compliance analysis of the agreement clause provided below.

Agreement Clause:
"{{contract_clause}}"

Auditing Criteria:
- Indemnification & Unlimited Liability Exposure
- GDPR Article 33 Breach Notification Timing (<= 72 hours)
- Governing Law & Dispute Resolution: {{governing_jurisdiction}}

Strict Guardrails:
- Do NOT provide generic legal disclaimers.
- Categorize risk severity strictly into: CRITICAL, HIGH, MEDIUM, or LOW.
- Provide a concrete replacement redline clause in standard legal format.

Output Format:
Return valid JSON matching the following schema:
{
  "risk_level": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "compliance_score": 0-100,
  "flagged_issue": "summary of violation",
  "suggested_redline": "exact contractual wording"
}`,
    defaultVariables: {
      contract_clause: 'Customer agrees to defend, indemnify and hold harmless Vendor without cap against all liabilities. Vendor shall notify customer of confirmed breaches within 90 days.',
      governing_jurisdiction: 'Delaware / EU GDPR Baselines'
    }
  },
  {
    id: 'tmpl-finops-analysis',
    title: 'LLM FinOps & Token Budget Analyzer',
    category: 'Analysis',
    tags: ['finops', 'billing', 'telemetry', 'optimization'],
    systemRole: 'You are a cloud FinOps engineer optimizing multi-tenant AI token expenditures.',
    templateText: `Analyze the following prompt payload for token efficiency and cost optimization:

Target Prompt / Payload:
"{{target_prompt}}"

Expected Monthly Volume: {{monthly_requests}} requests
Target Model: {{target_model}}

Tasks:
1. Identify unnecessary prompt bloat or redundant instructions.
2. Recommend caching strategies (e.g. prompt caching, SHA-256 fingerprinting).
3. Calculate projected dollar savings after optimization.

Constraint:
Keep instructions concise and provide a before/after token count comparison.`,
    defaultVariables: {
      target_prompt: 'Please read this 50-page document and summarize each paragraph one by one in great detail.',
      monthly_requests: '150,000',
      target_model: 'Gemini 3.8 Flash High vs Claude 3.7 Sonnet'
    }
  },
  {
    id: 'tmpl-system-prompt',
    title: 'Strict JSON Gatekeeper Agent',
    category: 'System',
    tags: ['agent', 'json', 'schema', 'tool-calling'],
    systemRole: 'You are a deterministic API transformation gateway.',
    templateText: `You are an autonomous JSON transformation worker.

Incoming Raw Data:
{{raw_input_data}}

Target Schema Requirement:
{{target_schema}}

Strict Operating Rules:
- Output ONLY valid RFC-8259 JSON.
- Never output conversational preamble, markdown backticks, or trailing explanations.
- If a required field cannot be determined, set its value to null.`,
    defaultVariables: {
      raw_input_data: 'Order #9021 for John Doe, 3 widgets at $12.50 each, priority overnight to Seattle, WA.',
      target_schema: '{ order_id: string, customer_name: string, line_items: [{ item: string, qty: number, unit_price: number }], shipping: { method: string, city: string, state: string } }'
    }
  }
];
