# PROMPT_ROUND_1.md — The Vague Prompt Drill

**Branch:** `workflow/round-one-vague`  
**Assignment:** FE-03 — The AI-Assisted Workflow Drill  
**Prompt Type:** Vague, one-sentence, context-free  

---

## 1. The Prompt Used

> *"build a settings form for my ai app"*

---

## 2. Methodology & Constraints

- No file references provided.
- No schema or validation library specified.
- No accessibility (WCAG) requirements requested.
- No edge-case or boundary conditions defined.
- Output accepted as-is without manual correction or prompting iteration.

---

## 3. The Resulting Output Analysis

1. **Architecture:** Component relies on 7 independent `useState` hooks, causing disjointed re-renders and potential race conditions.
2. **Validation:** Primitive inline `if (!apiKey)` checks that fail to catch format mismatches, whitespace attacks, or numeric boundary violations.
3. **Accessibility:** Complete absence of `htmlFor` / `id` pairings, `aria-invalid`, and `aria-describedby` error bindings.
4. **Verification:** Zero unit tests generated.

Run the verification runner:
```bash
node src/round1_runner.js
```
