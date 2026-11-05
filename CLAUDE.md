# CLAUDE.md — Frontend AI Engineering Guidelines

This repository hosts projects, capstones, and weekly assignments for the **FlyRank Frontend AI Engineering Track**. All AI assistants (Claude Code, Cursor, Antigravity) must strictly follow these instructions, conventions, and architectural standards.

---

## 1. Project Overview & Mission

- **Track:** Frontend AI Engineering (FlyRank Internship)
- **Author / Engineer:** KM Siam (`k.m.siam2019@gmail.com`)
- **Primary Objective:** Build reliable, production-ready, accessible, and performant frontend applications tightly integrated with modern AI primitives (Generative UI, streaming completions, multimodal inputs, agentic visual workflows, and client-side optimization).

---

## 2. Core Tech Stack & Toolchain

| Layer | Technologies | Standards / Configuration |
| :--- | :--- | :--- |
| **Runtime & Toolchain** | Node.js (LTS v24+), npm / pnpm, Git (2.50+) | ESM modules (`"type": "module"`) |
| **Frameworks** | Next.js (App Router) / React 19 / Vite | Server Components by default; explicit `'use client'` |
| **Language** | TypeScript 5.x | Strict Mode enabled, `noImplicitAny: true` |
| **Styling & Design System** | Tailwind CSS v3/v4, Shadcn UI, Radix Primitives | CSS variables, Lucide React icons, mobile-first |
| **AI Integration** | Vercel AI SDK (`ai`), `@ai-sdk/react`, OpenAI/Anthropic/Gemini SDKs | Streaming text/data, JSON schema tool calls |
| **State Management** | Zustand (client state), TanStack Query (server state) | Immutable updates, persisted slices |
| **Forms & Validation** | React Hook Form, Zod | Type-safe schema validation at boundaries |
| **Testing** | Vitest, React Testing Library, Playwright | Unit, integration, and E2E coverage |

---

## 3. Code Style & Architecture Guidelines

### Component Architecture
1. **Server vs. Client Components:**
   - Keep components on the server by default for SEO, performance, and reduced bundle size.
   - Mark interactive components with `'use client'` only when utilizing React hooks (`useState`, `useEffect`, `useActionState`), browser APIs, or event listeners.
2. **Component Structure:**
   - Group by feature domain or atomic layer (`components/ui`, `components/features`, `components/ai`).
   - Use named exports for components and utility functions.
   - Define Props interface explicitly: `interface ComponentNameProps { ... }`.
3. **State Modeling:**
   - Model asynchronous and AI states as explicit discriminated unions:
     ```typescript
     type AIState = 
       | { status: 'idle' }
       | { status: 'streaming'; partialContent: string }
       | { status: 'success'; content: string; metadata: TokenTelemetry }
       | { status: 'error'; error: Error };
     ```
   - Avoid boolean flag soup (`isLoading`, `isError`, `isSuccess`, `hasStreamingFinished`).

### Styling & Design System
- Utilize Tailwind utility classes with the `cn(...)` helper (`clsx` + `tailwind-merge`):
  ```typescript
  import { clsx, type ClassValue } from 'clsx';
  import { twMerge } from 'tailwind-merge';

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```
- Design for responsive viewports (`sm:`, `md:`, `lg:`, `xl:`) with dark mode support (`dark:` classes and CSS variables).
- Maintain WCAG 2.1 AA accessibility: proper color contrast ratios, focus rings (`focus-visible:ring-2`), and semantic HTML tags.

### Project-Specific Rules Learned from FE-03 Workflow Drill
1. **Schema-Driven Form Architecture:**
   All user-facing forms must use `react-hook-form` paired with `@hookform/resolvers/zod` and an externalized Zod schema in `src/schemas/`. Disjointed `useState` form state soup and manual inline string validation (e.g., `if (!input) alert(...)`) are strictly forbidden in code review.
2. **Mandatory WCAG 2.1 AA Form Accessibility:**
   Every form input must be programmatically paired with a dedicated `<label htmlFor={id}>` matching the control's `id`. When validation errors exist, the input must declare `aria-invalid={true}` and `aria-describedby` pointing to an error container carrying `role="alert"`. Form confirmation banners must declare `role="status"` with `aria-live="polite"`. Bare unassociated inputs without ARIA error semantics will fail review.
3. **Boundary Sanitation & Test Verification Gate:**
   Text inputs must enforce `.trim()` in their Zod schema to prevent whitespace-only bypasses, and numeric inputs must use `z.coerce.number()` with explicit `.min()` and `.max()` boundaries. Every interactive form component must be accompanied by an automated test suite verifying both valid submission and at least three boundary/invalid edge cases before merging.

---

## 4. Git & Commit Conventions (Conventional Commits 1.0.0)

All git commits in this repository must strictly adhere to the [Conventional Commits 1.0.0 specification](https://www.conventionalcommits.org/en/v1.0.0/):

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Approved Types:
- `feat`: A new feature or capability (e.g., `feat(ui): add streaming markdown renderer`).
- `fix`: A bug fix (e.g., `fix(chat): prevent duplicate stream chunks on reconnect`).
- `docs`: Documentation changes only (e.g., `docs(readme): update setup instructions`).
- `style`: Changes that do not affect the meaning of the code (formatting, white-space).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Changes to build process, dependencies, or auxiliary tools.

---

## 5. Development & Verification Commands

```bash
# Package installation
npm install

# Start local development server
npm run dev

# Run TypeScript type check
npm run typecheck

# Execute ESLint & Prettier
npm run lint
npm run format

# Run test suites
npm test

# Build production bundle
npm run build
```

---

## 6. AI Assistant Operating Instructions

When working in this codebase, the AI assistant must:
1. **Preserve Documentation Integrity:** Never delete comments, explanations, or historical context unless instructed.
2. **Enforce Type Safety:** Never use `any` or `@ts-ignore` to suppress errors. Fix root type mismatches.
3. **Zero Secrets in Code:** Never commit or hardcode API keys, auth tokens, or private endpoints. Always rely on `.env.local` and provide clean templates in `.env.example`.
4. **Always Test & Verify:** Verify syntactical and logical correctness before completing tasks.
