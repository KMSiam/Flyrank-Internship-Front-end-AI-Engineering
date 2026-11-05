# AGY.md — Google Antigravity Frontend AI Engineering Guidelines

This repository hosts projects, capstones, and weekly assignments for the **FlyRank Frontend AI Engineering Track**. All work in this repository is powered by **Google Antigravity (Powered by Gemini 3.8 Flash High / Advanced Agentic Coding)**.

---

## 1. Primary AI Environment

- **AI Platform:** Google Antigravity (AGY IDE & Agentic CLI)
- **Model:** Gemini 3.8 Flash High (DeepMind Advanced Agentic Coding)
- **Engineer:** KM Siam (`k.m.siam2019@gmail.com`)
- **Track:** Frontend AI Engineering (FlyRank Internship)
- **Standing Voice Card:** `Direct, technical, plain, disciplined, no buzzwords.`

---

## 2. Core Tech Stack & Toolchain

| Layer | Technologies | Standards / Configuration |
| :--- | :--- | :--- |
| **AI Environment** | Google Antigravity (Gemini 3.8 Flash High) | Subagents, Plan Mode, Artifact Generation, Verification Loops |
| **Runtime & Toolchain** | Node.js (LTS v24+), npm (v11+), Git (2.50+) | ESM modules (`"type": "module"`) |
| **Frameworks** | Next.js (App Router) / React 19 / Vite | Server Components by default; explicit `'use client'` |
| **Language** | TypeScript 5.x | Strict Mode enabled, `noImplicitAny: true` |
| **Styling & Design System** | Tailwind CSS v3/v4, Shadcn UI, Radix Primitives | CSS variables, Lucide React icons, mobile-first |
| **AI Integration** | Vercel AI SDK (`ai`), `@ai-sdk/react`, Gemini SDK | Streaming text/data, JSON schema tool calls |
| **State Management** | Zustand (client state), TanStack Query (server state) | Immutable updates, persisted slices |
| **Forms & Validation** | React Hook Form, Zod | Type-safe schema validation at boundaries |
| **Testing** | Vitest, React Testing Library, Playwright | Unit, integration, and E2E coverage |

---

## 3. Project-Specific Rules Learned (FE-03 Workflow Drill)

1. **Schema-Driven Form Architecture:**
   All user-facing forms must use `react-hook-form` paired with `@hookform/resolvers/zod` and an externalized Zod schema in `src/schemas/`. Disjointed `useState` form state soup and manual inline string validation (e.g. `if (!input) alert(...)`) are strictly forbidden in code review.
2. **Mandatory WCAG 2.1 AA Form Accessibility:**
   Every form input must be programmatically paired with a dedicated `<label htmlFor={id}>` matching the control's `id`. When validation errors exist, the input must declare `aria-invalid={true}` and `aria-describedby` pointing to an error container carrying `role="alert"`. Form confirmation banners must declare `role="status"` with `aria-live="polite"`. Bare unassociated inputs without ARIA error semantics will fail review.
3. **Boundary Sanitation & Test Verification Gate:**
   Text inputs must enforce `.trim()` in their Zod schema to prevent whitespace-only bypasses, and numeric inputs must use `z.coerce.number()` with explicit `.min()` and `.max()` boundaries. Every interactive form component must be accompanied by an automated test suite verifying both valid submission and at least three boundary/invalid edge cases before merging.

---

## 4. Multi-Toolchain Interoperability

While **Google Antigravity** is our primary agentic development environment, this repository maintains complete configuration compatibility for peer tools:
- **`CLAUDE.md`:** Claude Code configuration mirror.
- **`.cursorrules` & `.cursor/rules/frontend-ai.mdc`:** Cursor IDE configuration mirror.
- **Conventional Commits 1.0.0:** Enforced across all commits (`feat:`, `fix:`, `docs:`, `chore:`).
