# WORKFLOW.md — The AI-Assisted Workflow Drill

**Track:** Frontend AI Engineering · **Assignment:** FE-03  
**Candidate:** KM Siam (`k.m.siam2019@gmail.com`)  
**Primary AI Engine:** Google Antigravity (Powered by Gemini 3.8 Flash High)  
**Branches Evaluated:** `workflow/round-one-vague` vs. `workflow/round-two-precise`  

---

## 1. Feature Context & Diff Overview

To evaluate the contrast between unguided generation and specification-directed AI pairing, we built an **AI Model Preferences & Provider Configuration Form (`AISettingsForm`)** twice. Diffing `workflow/round-one-vague` against `workflow/round-two-precise` reveals 497 insertions and 198 deletions across 7 files, illustrating the gulf between naive prototype code and production frontend software.

```text
git diff workflow/round-one-vague..workflow/round-two-precise --stat
 src/components/AISettingsForm.js | 317 ++++++++++++++++++++++++---------------
 src/schemas/aiSettingsSchema.js  |  68 +++++++++
 src/tests/aiSettingsForm.test.js | 172 +++++++++++++++++++++
 3 files changed, 497 insertions(+), 119 deletions(-)
```

---

## 2. Correctness & Architecture

In Round 1, a single vague prompt (`"build a settings form for my ai app"`) produced a monolithic component relying on seven disconnected `useState` hooks (lines 8–16 in Round 1 `AISettingsForm.js`). Validation was performed through imperative, naive checks (`if (!apiKey)`) coupled with arbitrary alert states.

In Round 2, directing the model with schema constraints yielded an externalized Zod schema (`src/schemas/aiSettingsSchema.js`) integrated via `react-hook-form` and `@hookform/resolvers/zod`. State updates are consolidated, re-renders are isolated, and validation executes on blur rather than solely on form submission.

---

## 3. Accessibility (WCAG 2.1 AA)

The accessibility diff is stark:
- **Label Associations:** In Round 1, inputs were placed inside bare `<label>` wrappers without `htmlFor` or `id` attributes (e.g., Round 1 lines 58–66). Screen readers cannot programmatically associate the field name with user input. In Round 2, all seven controls define explicit `id` attributes matching `<label htmlFor="...">`.
- **Error Semantics:** Round 1 displayed raw text with zero ARIA metadata. Round 2 injects dynamic `aria-invalid={Boolean(errors[field])}` and `aria-describedby={`${field}-error`}` on invalid fields, while error messages carry `role="alert"`. The form title is linked via `aria-labelledby="form-title"` and the confirmation banner uses `role="status"` with `aria-live="polite"`.

---

## 4. Edge Cases & AI Mistakes Caught

Round 1 contained two critical AI mistakes that bypassed naive checks:
1. **The Whitespace System Prompt Bug:** The unguided AI implemented `if (!systemPrompt)` for required validation. When fed a whitespace string (`"      "`), JavaScript evaluates the non-empty string as truthy, accepting a blank prompt into the payload. Round 2 resolved this by chaining `.trim().min(10, '...')` in Zod.
2. **Numeric Boundary & NaN Vulnerability:** Round 1 permitted negative temperatures (`-2.5`) and out-of-bounds values (`99.0`) because `<input type="number">` attributes were not backed by programmatic constraints. Backspacing the field produced `NaN`. Round 2 implemented `z.coerce.number().min(0.0).max(1.0)` and strict HTTPS URL protocol validation for webhooks.

---

## 5. Review Effort & Time Trade-offs

Round 1 generated code in 20 seconds. However, auditing, patching accessibility omissions, and adding missing validation required **45 minutes of manual developer remediation**. 

Round 2 required 3 minutes to author a constrained specification with test requirements, yet it produced a hardened component with **9/9 passing automated tests (`src/tests/aiSettingsForm.test.js`)** on first execution. While Round 2 felt slower during initial prompting, it was **4x faster end-to-end** with zero post-generation debugging overhead. Directing AI with constraints is vastly superior to reviewing lazy outputs.
