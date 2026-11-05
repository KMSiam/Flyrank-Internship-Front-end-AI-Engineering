# PromptCraft Studio AI — Development Prompts Log
**Track:** Frontend AI Engineering · **Phase:** Foundations · **Week:** 3  
**AI Platform:** Google Antigravity (Powered by Gemini 3.8 Flash High / Advanced Agentic Coding)  
**Repository:** [https://github.com/KMSiam/Flyrank-Internship-Front-end-AI-Engineering](https://github.com/KMSiam/Flyrank-Internship-Front-end-AI-Engineering)

---

## Overview

This document provides a complete, chronological log of prompts utilized during the conception, architecture, implementation, refactoring, and automated testing of **PromptCraft Studio AI**. Every interaction was directed using structured, constraint-driven prompting in **Google Antigravity**, applying explore-plan-code verification loops.

---

## Phase 1: Architectural Scaffolding & Concept Design

### Prompt 1.1: System Architecture & Requirements Definition
```text
System Context:
You are an expert Frontend AI Systems Architect operating within Google Antigravity.
We are developing the Week 3 Foundations capstone for the FlyRank Frontend AI Engineering track:
"React app development with AI", inspired by mentor Ishak's interactive React architecture session.

Project Concept: PromptCraft Studio AI
An enterprise-grade, interactive prompt engineering, dynamic variable interpolation, and heuristic quality evaluation workbench built in React 19.

Requirements:
1. Define the architectural blueprint and directory structure for a Vite + React 19 single-page application.
2. Outline core modules:
   - Template repository management (CRUD, categories, filtering, cloning, JSON export/import).
   - Dynamic curly-brace variable extraction ({{variable}}) with live state binding.
   - Heuristic prompt quality scorecard (Clarity, Specificity, Constraints) with visual scoring 0-100.
   - Interactive model playground simulating token streaming with latency and FinOps token/cost estimation.
   - Pre-seeded enterprise templates (Coding, Compliance, Analysis, System).
3. Specify strict tech stack:
   - React 19, Vite, Lucide-react, native modern CSS/inline styles for bulletproof dark-theme rendering.
   - Zero external UI heavy framework dependencies (no Tailwind build step issues).
4. Provide the project tree and module boundary contracts.
```

### Prompt 1.2: Package Manifest & Vite Configuration
```text
Generate a clean, production-ready `package.json` and `vite.config.js` for "flyrank-internship-front-end-ai-engineering".
Include:
- Scripts: "dev", "build", "preview", "test", "test:app".
- Dependencies: react 19.3+, react-dom 19.3+, lucide-react, react-hook-form, zod.
- DevDependencies: vite 8+, @vitejs/plugin-react.
- Server configuration: Port 3000, host true.
- Build configuration: outDir 'dist', sourcemap false.
```

---

## Phase 2: Algorithmic Utilities & FinOps Engine

### Prompt 2.1: Regex Variable Parser & FinOps Cost Calculator
```text
Create `src/utils/promptParser.js` with pure, deterministic functions:
1. `extractVariables(templateText)`:
   - Use regex to extract all `{{variable_name}}` patterns.
   - Normalize and deduplicate variable keys.
   - Return an array of clean string identifiers. Handle null/undefined/empty input safely.
2. `interpolatePrompt(templateText, variables)`:
   - Replace every `{{variable_name}}` with its corresponding value from the variables record.
   - If a variable value is missing or empty, preserve the original placeholder `{{variable_name}}`.
3. `estimateTokens(text)`:
   - Implement a heuristic token estimator based on word and subword count (~1.33 tokens per English word, plus punctuation weighting).
4. `calculateEstimatedCost(promptTokens, completionTokens, modelId)`:
   - Provide standard published 2026 enterprise API pricing for:
     * Google Gemini 3.8 Flash High ($0.15 / $0.60 per 1M tokens)
     * Claude 3.7 Sonnet ($3.00 / $15.00 per 1M tokens)
     * OpenAI GPT-4o ($2.50 / $10.00 per 1M tokens)
   - Compute total combined transaction cost in USD, formatted to 6 decimal places.
```

### Prompt 2.2: Heuristic Static Quality Evaluation Engine
```text
Create `src/utils/evaluator.js` exporting `evaluatePromptQuality(promptText, variables)`.
The function must score the prompt across three dimensions (0–100):
1. Clarity (weight 35%):
   - Check for definitive action verbs (analyze, generate, extract, classify, audit, review).
   - Check for step-by-step reasoning instructions.
   - Length heuristic (penalize trivial prompts < 50 characters).
2. Specificity (weight 35%):
   - Check for persona / role definition ("you are", "act as", "role:").
   - Reward dynamic variable usage (presence of extracted parameters).
   - Check for few-shot examples or input/output schema definitions.
3. Constraint Guardrails (weight 30%):
   - Check for explicit output format instructions (JSON, Markdown, schema).
   - Check for negative constraints ("do not", "never", "avoid", "strictly").
   - Check for output length boundaries ("maximum", "limit", "tokens").

Output structure:
Return `{ overallScore, qualityTier, clarityScore, specificityScore, constraintScore, suggestions }`
where qualityTier is 'EXCELLENT' (>=85), 'GOOD' (>=70), 'MODERATE' (>=50), or 'POOR' (<50), and suggestions contains up to 4 actionable improvement points.
```

---

## Phase 3: Domain Data & Modular UI Components

### Prompt 3.1: Pre-Seeded Enterprise Templates
```text
Create `src/data/defaultTemplates.js` containing at least 4 production-grade prompt templates:
1. 'tmpl-coding-arch': "Full-Stack Feature Architect" (Coding) with variables {{feature_requirement}}, {{framework}}, {{state_solution}}.
2. 'tmpl-compliance-audit': "Regulatory & Contract Clause Auditor" (Compliance) with variables {{contract_clause}}, {{governing_jurisdiction}}.
3. 'tmpl-finops-analysis': "LLM Token FinOps & Cost Optimizer" (Analysis) with variables {{workload_description}}, {{monthly_budget_usd}}, {{peak_qps}}.
4. 'tmpl-system-gatekeeper': "Strict JSON Schema Gatekeeper" (System) with variables {{raw_unstructured_input}}, {{target_schema}}.

Each template must include: `id`, `title`, `category`, `tags`, `systemRole`, `templateText`, and `defaultVariables`.
```

### Prompt 3.2: Header Component
```text
Create `src/components/Header.jsx`:
- Show brand logo and title "PromptCraft Studio AI".
- Prominently display a badge: "Engine: Google Antigravity (Gemini 3.8 Flash High)".
- Action buttons:
  * "New Prompt" button with Plus icon.
  * "Export JSON" button with Download icon.
  * "Import JSON" hidden file input with Upload icon button and JSON parsing handler.
- Modern dark-palette styling (#0d111a background, slate borders, responsive flex layout).
```

### Prompt 3.3: Template Navigator Component
```text
Create `src/components/TemplateList.jsx`:
- Search bar with instant filtering by title or tags.
- Category filter pills: All, Coding, Compliance, Analysis, System.
- Render list of prompt template cards with:
  * Category badge with distinct domain colors.
  * Template title and tag pills.
  * Dynamic variable count pill.
  * Duplicate and Delete action buttons with confirmation.
  * Active selection styling.
```

### Prompt 3.4: Prompt Editor Component
```text
Create `src/components/PromptEditor.jsx`:
- Header showing template identifier input and category dropdown.
- System Persona / Pre-Prompt input.
- Large monospace textarea for `templateText` with custom syntax highlighting or clean formatting.
- Live telemetry bar beneath the editor displaying:
  * Detected variable count.
  * Estimated prompt tokens.
  * Estimated cost per invocation for Google Gemini 3.8 Flash High.
```

### Prompt 3.5: Variable Inputs & Interpolation Preview Component
```text
Create `src/components/VariableInputs.jsx`:
- Read template text and dynamically render input fields for all detected `{{variable_name}}` placeholders.
- Provide a collapsible or live "Compiled Prompt Preview" showing the interpolated text in real-time.
- Include a "Copy Interpolated Prompt" button with clipboard feedback state ("Copied!").
- Handle edge case where no variables are detected with a helpful empty state.
```

### Prompt 3.6: AI Playground & Token Streaming Simulator Component
```text
Create `src/components/Playground.jsx`:
- Model selector: Gemini 3.8 Flash High (default), Claude 3.7 Sonnet, OpenAI GPT-4o.
- Temperature and Max Tokens parameter sliders.
- "Simulate Execution" button with realistic token-by-token streaming animation (using setInterval / requestAnimationFrame).
- "Stop" execution abort button.
- Clean output terminal displaying the streaming response.
- Post-execution telemetry panel:
  * Generation latency in milliseconds.
  * Output tokens and throughput (tokens/sec).
  * Calculated API execution cost in USD.
- Proper cleanup of streaming timers on template switch or component unmount.
```

### Prompt 3.7: Quality Scorecard Component
```text
Create `src/components/Scorecard.jsx`:
- Call `evaluatePromptQuality(templateText, variables)`.
- Render overall score circular or badge indicator with tier coloring (EXCELLENT, GOOD, MODERATE, POOR).
- Three animated progress bars: Clarity (35%), Specificity (35%), Guardrails (30%).
- Actionable recommendations checklist highlighting detected omissions (missing action verbs, missing persona, lack of schema constraints).
```

---

## Phase 4: State Orchestration & Application Shell

### Prompt 4.1: App.jsx Integration & LocalStorage Persistence
```text
Assemble the complete application in `src/App.jsx`:
- Load templates from localStorage (`promptcraft_studio_templates`), falling back to `DEFAULT_TEMPLATES`.
- Maintain activeTemplateId and variables state per template.
- Implement handlers:
  * `handleSelectTemplate(id)`
  * `handleUpdateTemplate(updatedTemplate)`
  * `handleNewTemplate()`
  * `handleDuplicateTemplate(id)`
  * `handleDeleteTemplate(id)`
  * `handleVariableChange(varName, value)`
  * `handleExport()` (triggers JSON file download)
  * `handleImport(parsed)` (validates schema and merges)
- Build a 3-column responsive layout:
  * Column 1: Template Navigator (300px).
  * Column 2: Prompt Editor & Variable Inputs (flexible flex-1).
  * Column 3: Quality Scorecard & Playground Simulator (420px).
- Add studio status footer with active template title and Google Antigravity engine attribution.
```

---

## Phase 5: Verification & Automated Test Suite

### Prompt 5.1: Automated Verification Suite
```text
Write a standalone automated test script `tests/promptcraft.test.js` using Node.js native assert:
1. Test `extractVariables` for single, multiple, duplicate, and empty inputs.
2. Test `interpolatePrompt` for exact replacement, missing variables, and empty values.
3. Test `estimateTokens` and `calculateEstimatedCost` across all three models.
4. Test `evaluatePromptQuality` for strong and weak prompt scenarios.
5. Test `DEFAULT_TEMPLATES` integrity (verify all required fields, category correctness, and variable parity).
Ensure 100% pass rate with zero external test runner dependencies.
```
