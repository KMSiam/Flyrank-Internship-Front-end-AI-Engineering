# PROMPT_ROUND_2.md — The Precise Prompt & Verification Loop

**Branch:** `workflow/round-two-precise`  
**Assignment:** FE-03 — The AI-Assisted Workflow Drill  
**Prompt Type:** Specification-driven, schema-first, test-verified  

---

## 1. The Precise Prompt Used

```markdown
Build an enterprise-grade AI Model Preferences & Provider Settings form component (`AISettingsForm`) in `src/components/AISettingsForm.js` adhering strictly to `CLAUDE.md` and `.cursorrules`:

1. **Schema & Validation (`src/schemas/aiSettingsSchema.js`):**
   - Use Zod for schema validation.
   - `apiKey`: required, must match regex `^(sk-[a-zA-Z0-9_\-]{16,}|anthropic-[a-zA-Z0-9_\-]{16,})$`.
   - `model`: enum (`claude-3-7-sonnet`, `claude-3-5-haiku`, `gpt-4o`, `gemini-1.5-pro`).
   - `temperature`: coerced number between 0.0 and 1.0 (step 0.05).
   - `maxTokens`: coerced integer between 256 and 8192 (step 128).
   - `systemPrompt`: trimmed string, min 10 characters, max 2000 characters. Reject whitespace-only strings.
   - `streamResponse`: boolean flag, default true.
   - `webhookUrl`: optional string. If non-empty, must validate as HTTPS URL protocol.

2. **Component Architecture & Form Handling:**
   - Integrate with `react-hook-form` using `@hookform/resolvers/zod`.
   - Implement asynchronous submit lifecycle with loading/saving state.
   - Display dynamic character counter for `systemPrompt` (0 / 2000 chars).

3. **Accessibility (WCAG 2.1 AA Compliance):**
   - Explicit `id` for every input matched to `<label htmlFor="...">`.
   - `aria-invalid={Boolean(errors[field])}` and `aria-describedby` referencing error messages.
   - Error messages must carry `role="alert"`.
   - Form-level success/error banner with `role="status"` and `aria-live="polite"`.

4. **Verification Step:**
   - Write comprehensive automated tests in `src/tests/aiSettingsForm.test.js` covering valid submission, API key regex, numeric bounds, whitespace trimming, HTTPS safety, and accessibility markup.
   - Run tests and verify 100% passing rate before completing.
```

---

## 2. Engineering Verification Results

- **Test Suite:** `src/tests/aiSettingsForm.test.js`
- **Runner:** `node src/round2_runner.js`
- **Result:** 9/9 Tests Passed (100% Success Rate)

```text
  ✔ PASS [1]: Valid enterprise configuration passes schema validation
  ✔ PASS [2]: Invalid API key prefix rejected by regex constraint
  ✔ PASS [3]: Short API key (< 16 characters) rejected
  ✔ PASS [4]: Negative temperature (-0.25) rejected
  ✔ PASS [5]: Temperature exceeding 1.0 (1.45) rejected
  ✔ PASS [6]: Whitespace-only system prompt rejected after .trim()
  ✔ PASS [7]: Non-HTTPS webhook URL (insecure http://) rejected
  ✔ PASS [8]: Empty webhook URL gracefully accepted as optional
  ✔ PASS [9]: AISettingsForm renders complete WCAG 2.1 AA semantic markup
```
