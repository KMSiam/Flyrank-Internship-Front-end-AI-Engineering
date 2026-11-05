# FlyRank Frontend AI Engineering Track

![Track](https://img.shields.io/badge/Track-Frontend_AI_Engineering-blue.svg)
![Candidate](https://img.shields.io/badge/Engineer-KM_Siam-emerald.svg)
![AI Platform](https://img.shields.io/badge/AI_Platform-Google_Antigravity-4285F4.svg)
![Model](https://img.shields.io/badge/Model-Gemini_3.8_Flash_High-orange.svg)
![Node.js](https://img.shields.io/badge/Node.js-v24.13.1_LTS-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x_Strict-blue.svg)
![License](https://img.shields.io/badge/License-MIT-gray.svg)

This repository contains the complete portfolio of assignments, prototypes, and capstone projects developed during the **FlyRank Frontend AI Engineering Internship**. It reflects a disciplined, AI-accelerated frontend development workflow adhering to industry best practices in modern web architecture, accessibility (WCAG 2.1 AA), and streaming AI primitives.

---

## 1. Candidate & Track Overview

- **Engineer:** KM Siam (`k.m.siam2019@gmail.com`)
- **Institution:** Southeast University (SEU), Dhaka | FlyRank AI Intern
- **Track:** Frontend AI Engineering
- **Phase:** Week 1 — Setup & AI Toolchain (`FE-01`)
- **Standing Voice Card:** `Direct, technical, plain, disciplined, no buzzwords.`
- **Design System:** `Inter` & `JetBrains Mono` • Palette: `#0F172A`, `#F8FAFC`, `#0284C7`, `#10B981`

---

## 2. Core Frontend AI Competencies

The projects across this track demonstrate mastery in five foundational frontend AI capabilities:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   FRONTEND AI ENGINEERING CAPABILITIES                 │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ 1. Generative UI  │ 2. Streaming Chat │ 3. Multimodal Interfaces       │
│ Dynamic component │ Token-by-token    │ Vision input, audio recording, │
│ rendering driven  │ streaming with    │ canvas manipulation, and       │
│ by JSON Schemas   │ backpressure &    │ real-time multimodal feedback  │
│ and tool calls    │ smooth UX typing  │ loops                          │
├───────────────────┴───────────────────┴────────────────────────────────┤
│ 4. Visual Workflow Graphs             │ 5. Client FinOps & Governance │
│ Dynamic node execution with           │ Token meter tracking, cost     │
│ React Flow & stateful branch logic    │ attribution, and latency audit │
└───────────────────────────────────────┴────────────────────────────────┘
```

---

## 3. Verified Environment & AI Toolchain

| Tool / Runtime | Installed Version | Purpose / Role |
| :--- | :--- | :--- |
| **Primary AI Platform** | **Google Antigravity** (Gemini 3.8 Flash High) | DeepMind Advanced Agentic Coding IDE, CLI, and autonomous reasoning engine |
| **Node.js** | `v24.13.1` (LTS) | Core JavaScript/TypeScript execution runtime |
| **npm** | `11.8.0` | Package manager and script lifecycle runner |
| **Git** | `2.55.0.windows.4` | Version control with Conventional Commits 1.0.0 |
| **Cross-Tool Compatibility** | Claude Code `2.1.138` / Cursor / VS Code | Multi-assistant specification compatibility via `CLAUDE.md` and `.cursorrules` |
| **TypeScript** | `5.x` | Strict compile-time safety and discriminated union states |

---

## 4. Quickstart & Development Setup

### Prerequisites
Ensure Node.js (LTS v24+) and Git are installed:
```bash
node -v   # Expected: v24.x+
git --version
```

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/KMSiam/Flyrank-Internship-Front-end-AI-Engineering.git
cd Flyrank-Internship-Front-end-AI-Engineering

# 2. Install workspace dependencies
npm install

# 3. Verify linting & code formatting
npm run lint
```

---

## 5. Completed Track Assignments & Milestones

### Week 7 (FE-AA2 · 3h · Build+): Your First 3D Experience on the Web
- **Live 3D URL:** [https://flyrank-internship-front-end-ai-engineering.vercel.app/three-d](https://flyrank-internship-front-end-ai-engineering.vercel.app/three-d)
- **3D Web Architecture Overview:** Engineered an interactive WebGL 3D Quantum Neural Node scene built on Three.js r170 with procedural geometry, physical PBR lighting, real-time configurator controls, and responsible performance budgeting.
- **Core 3D Capabilities & FE-10 Performance Lens:**
  - 🌐 **WebGL Scene & Staging:** Renders a central faceted neural core and an orbiting tensor flux ring with a three-point physical lighting rig (ambient, directional key, and colored fill/rim lights).
  - 🎨 **Configurator Dashboard:** Live interactive controls for geometry switching (Icosahedron, Torus Knot, Dodecahedron), 6 color presets, metalness/roughness physical sliders, and wireframe toggles.
  - 🚀 **Zero Model Download (0 KB):** All geometries are generated procedurally, eliminating 5–20MB uncompressed GLB asset downloads.
  - 📱 **Mobile Touch Orbit & Thermal Ceiling:** Renderer Device Pixel Ratio is capped at 2.0 (`Math.min(devicePixelRatio, 2)`) to prevent GPU overheating on high-density mobile screens.
  - ♿ **Responsible Lazy-Loading & A11y:** Canvas dynamically imported with `ssr: false` and a static skeleton fallback; honors `prefers-reduced-motion` by auto-pausing rotation.
- **Assignment Deliverables:**
  - [**`FlyRank_FEAA2_3D_Experience_Report.pdf`**](./FlyRank_FEAA2_3D_Experience_Report.pdf): Primary publication deliverable documenting 3D staging, PBR lighting, and FE-10 performance benchmarks.
  - [**`src/components/three/ThreeScene.jsx`**](./src/components/three/ThreeScene.jsx): Core Three.js WebGL scene with touch orbit controls.
  - [**`src/components/three/ThreeSceneClient.jsx`**](./src/components/three/ThreeSceneClient.jsx): Dynamic client wrapper with skeleton fallback.
  - [**`src/app/three-d/page.jsx`**](./src/app/three-d/page.jsx): Next.js App Router 3D experience route.
  - [**`tests/three-scene.test.js`**](./tests/three-scene.test.js): Automated test suite with 4/4 passing tests (67/67 total test suite).
  - [**`submission_notes_fe_aa2.txt`**](./submission_notes_fe_aa2.txt): Copy-paste portal submission notes.

### Week 6 (FE-09 · 5h · Build polish): Testing pass — Vitest, RTL & CI Verification
- **Live Preview URL:** [https://flyrank-internship-front-end-ai-engineering.vercel.app](https://flyrank-internship-front-end-ai-engineering.vercel.app)
- **Testing Architecture Overview:** Scaled agentic verification by establishing Vitest + React Testing Library component tests, mock streaming AI routes, Playwright E2E specs, and an automated GitHub Actions CI pipeline.
- **Core Architecture & Capabilities:**
  - 🧪 **Vitest & React Testing Library:** Configured `vitest.config.js` with `jsdom` environment. Tests query strictly by accessible roles, labels, and text — preserving durability across CSS refactorings.
  - 💬 **Comprehensive Message Renderer Tests:** 6 tests in [`tests/components/StreamingChat.test.jsx`](./tests/components/StreamingChat.test.jsx) verifying first-run empty states, typing, pending thinking skeletons, streaming token delta accumulation, 429 rate limit error states with working retry, and abort controls.
  - 🛠️ **Tool Result & Form Component Tests:** Tests in [`tests/components/ToolComponents.test.jsx`](./tests/components/ToolComponents.test.jsx) and [`tests/components/ValidatedForm.test.jsx`](./tests/components/ValidatedForm.test.jsx) validating PromptScoreCard, ToolErrorCard, and Zod alert boundaries.
  - 🎭 **Mocked AI Streaming Routes:** Client-side `ReadableStream` SSE mocks prevent real API token expenditures and network non-determinism during automated test runs.
  - 🌐 **Playwright E2E Primary Flow:** [`e2e/primary-flow.spec.js`](./e2e/primary-flow.spec.js) walks the complete user journey on `/chat` (navigation &rarr; prompt entry &rarr; submission &rarr; streaming token verification).
  - 🚀 **GitHub Actions CI Pipeline:** [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) executes on every push/PR, verifying 63 integration tests, 11 vitest component tests, and Next.js 15 production build.
- **Assignment Deliverables:**
  - [**`FlyRank_FE09_Testing_Pass_Report.pdf`**](./FlyRank_FE09_Testing_Pass_Report.pdf): Primary publication deliverable documenting Vitest configuration, component tests, Playwright specs, and CI setup.
  - [**`vitest.config.js`**](./vitest.config.js): Vitest runner configuration with jsdom.
  - [**`tests/components/StreamingChat.test.jsx`**](./tests/components/StreamingChat.test.jsx): Chat component test suite.
  - [**`tests/components/ToolComponents.test.jsx`**](./tests/components/ToolComponents.test.jsx): Tool result component test suite.
  - [**`tests/components/ValidatedForm.test.jsx`**](./tests/components/ValidatedForm.test.jsx): Form component test suite.
  - [**`e2e/primary-flow.spec.js`**](./e2e/primary-flow.spec.js): Playwright primary flow E2E test.
  - [**`.github/workflows/ci.yml`**](./.github/workflows/ci.yml): GitHub Actions CI workflow.
  - [**`submission_notes_fe09.txt`**](./submission_notes_fe09.txt): Copy-paste portal submission notes.

### Week 6 (FE-AA1 · 2h · Build+): Buttons with a Brain — Motion & State Micro-interactions
- **Live Demo URL:** [https://flyrank-internship-front-end-ai-engineering.vercel.app/micro-interactions](https://flyrank-internship-front-end-ai-engineering.vercel.app/micro-interactions)
- **Micro-interactions Overview:** Engineered the `SmartButton` component handling 6 distinct lifecycle states with intentional motion: *idle &rarr; hover/focus &rarr; active &rarr; loading &rarr; success/error &rarr; auto-revert to idle*.
- **Motion & State Architecture:**
  - 🎭 **6-State Choreography:** Zero abrupt swaps. Transitions smoothly between idle, hover sheen, tactile active scale (`0.98`), loading spinner, scaling success checkmark (`1.1`), and physics-based error shake.
  - ⏱️ **Duration & Easing Rationale:** Standard state changes run at **200ms ease-out** for snappy, immediate user feedback. Error state implements a **350ms physics-modeled shake** with `cubic-bezier(0.36, 0.07, 0.19, 0.97)`.
  - ⚡ **Compositor Performance:** Animates exclusively `transform` and `opacity` properties to prevent layout thrash (0 CLS).
  - ♿ **Reduced Motion & A11y:** Strict `prefers-reduced-motion` compliance eliminates animations under `motion-reduce`, while preserving color and text feedback. Features `focus-visible:ring-2` and `aria-live="polite"`.
  - 🔄 **System Flexibility (Two Coordinated Buttons):** Powers both the Primary Chat Sender ("Send Message") and Secondary Generative Tool ("Run Audit") on the live demo workbench with forced success/error triggers.
- **Assignment Deliverables:**
  - [**`FlyRank_FEAA1_Buttons_With_Brain_Report.pdf`**](./FlyRank_FEAA1_Buttons_With_Brain_Report.pdf): Primary publication deliverable documenting the 6-state choreography, timing curves, and compositor benchmarks.
  - [**`src/components/ui/SmartButton.jsx`**](./src/components/ui/SmartButton.jsx): Production SmartButton component.
  - [**`src/app/micro-interactions/page.jsx`**](./src/app/micro-interactions/page.jsx): Interactive demo workbench with trigger controls.
  - [**`tests/smart-button.test.js`**](./tests/smart-button.test.js): Automated test suite with 6/6 passing tests (63/63 total test suite).
  - [**`submission_notes_fe_aa1.txt`**](./submission_notes_fe_aa1.txt): Copy-paste portal submission notes.

### Week 5 (FE-08 · 4h · Build · Checkpoint 1): Error states, empty states, edge cases
- **Live Preview URL:** [https://flyrank-internship-front-end-ai-engineering.vercel.app/chat](https://flyrank-internship-front-end-ai-engineering.vercel.app/chat)
- **Checkpoint 1 Overview:** Hardened the primary streaming AI conversational flow at `/chat` against all failure and edge conditions: network failures, mid-stream connection drops, upstream 429 rate limits, empty inputs, slow response CLS, and route crashes.
- **Core Architecture & Capabilities:**
  - 🚨 **Systematic Failure Inventory & Sabotage Drills:** Implemented server and client hooks for 5 failure modes: blank inputs (HTTP 400), 429 quota exhaustion (`Retry-After: 15`), 503 provider outages, mid-stream drops (`ERR_MIDSTREAM_DROP`), and latency delay simulations.
  - 🧠 **Buttons with a Brain (Retry Micro-Interaction):** Turn-targeted retry button debounces against rapid clicks, displays dynamic spinner status ("Retrying turn..."), and deterministically recovers the specific failed turn while preserving partial tokens.
  - 🌟 **Designed Empty State Onboarding:** Replaced dead-end "No conversations yet" with an onboarding hub featuring 4 click-to-fill action cards (Component Architecture, FinOps budget, Mid-Stream sabotage drill, 429 rate limit drill).
  - 🛡️ **App Router Error Boundaries:** Created global boundary ([`src/app/error.jsx`](./src/app/error.jsx)) with `reset()` action, route-level boundary ([`src/app/chat/error.jsx`](./src/app/chat/error.jsx)), and designed 404 handler ([`src/app/not-found.jsx`](./src/app/not-found.jsx)).
  - 📐 **Layout-Accurate Skeleton (Zero CLS):** Thinking indicator skeleton matches real message typography and layout within pixels, preventing Cumulative Layout Shift.
  - 📱 **Mobile Safari Hardening:** Configured `min-h-[100dvh]`, `overscroll-contain`, and safe-area insets (`pb-[env(safe-area-inset-bottom)]`) to prevent software keyboard shifting.
- **Assignment Deliverables:**
  - [**`FlyRank_FE08_Error_States_Report.pdf`**](./FlyRank_FE08_Error_States_Report.pdf): Primary publication deliverable documenting failure inventories, sabotage test proofs, and Checkpoint 1 signoff.
  - [**`src/components/chat/StreamingChat.jsx`**](./src/components/chat/StreamingChat.jsx): Hardened client streaming chat component with designed empty state and retry button.
  - [**`src/app/api/chat/route.js`**](./src/app/api/chat/route.js): Route handler with validation and deterministic sabotage test hooks.
  - [**`src/app/error.jsx`**](./src/app/error.jsx): Global route error boundary.
  - [**`src/app/chat/error.jsx`**](./src/app/chat/error.jsx): Chat route error boundary.
  - [**`src/app/not-found.jsx`**](./src/app/not-found.jsx): Designed 404 handler.
  - [**`tests/error-states.test.js`**](./tests/error-states.test.js): Automated test suite with 10/10 passing tests (57/57 total test suite).
  - [**`submission_notes_fe08.txt`**](./submission_notes_fe08.txt): Copy-paste portal submission notes.

### Week 5 (FE-07 · 5h · Build): Tool results and structured output in the UI
- **Live Preview URL:** [https://flyrank-internship-front-end-ai-engineering.vercel.app/generative-ui](https://flyrank-internship-front-end-ai-engineering.vercel.app/generative-ui)
- **Generative UI Overview:** Built a typed server-side tool execution pipeline and complete Generative UI lifecycle renderer in Next.js 15 App Router + React 19 + Zod.
- **Core Architecture & Capabilities:**
  - 🛠️ **Server-Side Tool Specification:** Implemented `scorePromptEngineering` in [`src/lib/tools/promptAuditTool.js`](./src/lib/tools/promptAuditTool.js) with strict `zod` schema validation and deterministic heuristic execution across Clarity (35%), Specificity (35%), and Guardrails (30%).
  - 🔄 **4-State Lifecycle Rendering:** [`src/components/tools/ToolPartRenderer.jsx`](./src/components/tools/ToolPartRenderer.jsx) transforms raw execution steps into visually distinct treatments instead of JSON dumps:
    - `input-streaming`: Shimmering skeleton, live token telemetry, and pulsing radar spinner.
    - `input-available`: Structured pill argument inspector with parameter badges.
    - `output-available`: Rich `PromptScoreCard` component with visual metrics.
    - `output-error`: Designed `ToolErrorCard` with error taxonomy and interactive retry button.
  - 📊 **Rich Component Visualization:** [`src/components/tools/PromptScoreCard.jsx`](./src/components/tools/PromptScoreCard.jsx) renders composite quality grade (`EXCELLENT`, `GOOD`, `MODERATE`, `NEEDS WORK`), dimension progress bars, hand-rolled responsive SVG bar chart, actionable recommendations checklist, and latency/token telemetry.
  - 🛡️ **Designed Error State:** [`src/components/tools/ToolErrorCard.jsx`](./src/components/tools/ToolErrorCard.jsx) handles execution failures gracefully (e.g., `ERR_INSUFFICIENT_CONTEXT`) with human remediation guidance and a safe retry trigger without white-screen crashes.
  - 🧪 **Interactive Generative UI Demo:** Live demonstration harness at [`src/app/generative-ui/page.jsx`](./src/app/generative-ui/page.jsx) allowing evaluators to trigger both standard execution and simulated failure recovery states.

#### Tool Contract: `scorePromptEngineering`
- **Tool Name:** `scorePromptEngineering`
- **Description:** Audits and scores a prompt engineering template against clarity, specificity, and guardrails with optimization recommendations.
- **Input Schema (`zod`):**
  ```typescript
  z.object({
    promptText: z.string().min(5).max(4000),
    targetDomain: z.enum(["coding", "compliance", "analysis", "general"]).default("general"),
    minimumScoreThreshold: z.number().min(0).max(100).optional().default(70),
  })
  ```
- **Return Shape:**
  ```typescript
  interface PromptAuditResult {
    success: boolean;
    overallScore: number;
    verdict: "EXCELLENT" | "GOOD" | "MODERATE" | "NEEDS WORK";
    dimensions: {
      clarity: number;
      specificity: number;
      guardrails: number;
    };
    recommendations: string[];
    telemetry: {
      latencyMs: number;
      tokenCount: number;
      toolName: string;
    };
    error?: {
      code: string;
      message: string;
      remediation: string;
    };
  }
  ```
- **Assignment Deliverables:**
  - [**`FlyRank_FE07_Tool_Results_GenUI_Report.pdf`**](./FlyRank_FE07_Tool_Results_GenUI_Report.pdf): Primary publication deliverable documenting the tool contract, 4 lifecycle states, and error recovery boundaries.
  - [**`src/lib/tools/promptAuditTool.js`**](./src/lib/tools/promptAuditTool.js): Server-side tool definition with Zod schema and execute function.
  - [**`src/components/tools/ToolPartRenderer.jsx`**](./src/components/tools/ToolPartRenderer.jsx): Master 4-state lifecycle renderer.
  - [**`src/components/tools/PromptScoreCard.jsx`**](./src/components/tools/PromptScoreCard.jsx): Rich component visualization.
  - [**`src/components/tools/ToolErrorCard.jsx`**](./src/components/tools/ToolErrorCard.jsx): Designed error state component.
  - [**`tests/tools.test.js`**](./tests/tools.test.js): Automated test suite with 6/6 passing tests (47/47 total test suite).
  - [**`submission_notes_fe07.txt`**](./submission_notes_fe07.txt): Copy-paste portal submission notes.

### Week 4 (FE-06 · 6h · Build): Streaming AI chat interface
- **Live Preview URL:** [https://flyrank-internship-front-end-ai-engineering.vercel.app/chat](https://flyrank-internship-front-end-ai-engineering.vercel.app/chat)
- **Central AI Interaction Overview:** Built a hardened, production-grade streaming AI chat interface in Next.js 15 App Router + React 19 + Server-Sent Events (SSE).
- **Core Architecture & Capabilities:**
  - ⚡ **Token-by-Token SSE Stream:** Server route handler (`src/app/api/chat/route.js`) delivers typed chunk frames with realistic 30ms token pacing, and pure server-side API key handling.
  - 🧠 **Thinking Shimmer Handoff:** Displays a smooth pulsing thinking indicator before the first token arrives and hands off seamlessly into streaming text without UI flicker.
  - ⏹️ **State-Preserving Stop Button:** `AbortController.abort()` halts streaming mid-flight, preserves all partial text received, re-enables the prompt input, and allows subsequent conversation turns.
  - 📜 **Resilient Auto-Scroll Pinning:** Continuously monitors scroll position relative to bottom (&lt;80px); releases bottom pinning when the user scrolls up to review prior messages, and renders a floating "Scroll to latest" button.
  - ⚙️ **Centralized Configuration:** Model configuration and system prompts are cleanly isolated in [`src/lib/aiConfig.js`](./src/lib/aiConfig.js).
  - 💾 **Multi-Turn History Persistence:** Conversational state persists across multiple turns and survives browser reloads via `localStorage`.
- **Assignment Deliverables:**
  - [**`FlyRank_FE06_Streaming_Chat_Report.pdf`**](./FlyRank_FE06_Streaming_Chat_Report.pdf): Primary publication deliverable documenting SSE streaming, thinking handoff, stop state handling, and auto-scroll logic.
  - [**`src/app/api/chat/route.js`**](./src/app/api/chat/route.js): Server route handler.
  - [**`src/components/chat/StreamingChat.jsx`**](./src/components/chat/StreamingChat.jsx): Client streaming chat interface.
  - [**`src/lib/aiConfig.js`**](./src/lib/aiConfig.js): Centralized model config and system prompt module.
  - [**`tests/streaming.test.js`**](./tests/streaming.test.js): Automated test suite with 7/7 passing tests (41/41 total test suite).
  - [**`submission_notes_fe06.txt`**](./submission_notes_fe06.txt): Copy-paste portal submission notes.

### Week 4 (FE-05 · 5h · Build): Accessible component fundamentals
- **Assignment Overview:** Hand-crafted three accessible interactive components completely from scratch in React 19 + TypeScript adhering to the **W3C ARIA Authoring Practices Guide (APG)** patterns with zero component libraries.
- **Components Built in [`playground/`](./playground):**
  - 🪟 **Modal Dialog (`Modal.tsx`):** `role="dialog"`, `aria-modal="true"`, dynamic `aria-labelledby`/`aria-describedby`, strict `Tab`/`Shift+Tab` focus trap, `Escape` key close, and focus restoration to the triggering element.
  - 📑 **Tabs Widget (`Tabs.tsx`):** `role="tablist"`, `role="tab"`, `role="tabpanel"`, roving `tabIndex` (`0` active, `-1` inactive), `ArrowLeft`/`ArrowRight` cycling, and `Home`/`End` extremity navigation.
  - 📂 **Disclosure Widget (`Disclosure.tsx`):** Native button trigger with `aria-expanded` and `aria-controls` linked to an expandable `role="region"` with `aria-labelledby`, supporting `Enter` and `Space` activation.
  - 🧪 **Interactive Playground (`playground/index.tsx`):** Live interactive playground mounted at `/playground` in Next.js 15.
- **Source Code Audit & Comparison:**
  - [**`NOTES.md`**](./NOTES.md): Comprehensive analysis comparing custom hand-crafted components against **shadcn/ui** (Radix UI primitives), documenting 5 concrete architectural gaps (Portal rendering to `document.body`, scroll locking with scrollbar width layout shift compensation, screen reader sibling inerting via `aria-hidden`, focus guard sentinels, and polymorphic `asChild` composition).
- **TypeScript Prop Strictness:** `npx tsc --noEmit` verified with 0 errors and zero `any` escapes in component props interfaces.
- **Assignment Deliverables:**
  - [**`FlyRank_FE05_Accessible_Components_Report.pdf`**](./FlyRank_FE05_Accessible_Components_Report.pdf): Primary publication deliverable documenting APG compliance, focus trapping, and comparative audit.
  - [**`playground/`**](./playground): Complete TypeScript component source code.
  - [**`tests/accessibility.test.js`**](./tests/accessibility.test.js): Automated test suite with 10/10 passing tests (`npm test`).
  - [**`submission_notes_fe05.txt`**](./submission_notes_fe05.txt): Copy-paste portal submission notes.

### Week 3 (FE-04 · 4h · Foundations): Capstone skeleton, deployed
- **Live Preview URL:** [https://flyrank-internship-front-end-ai-engineering.vercel.app](https://flyrank-internship-front-end-ai-engineering.vercel.app)
- **Deployment Strategy:** Practicing the professional standard of **deploying on day one**, with every commit landing on a live preview deployment. Configured with `vercel.json` and zero secrets committed.
- **Architectural Implementation:**
  - ⚡ **Next.js 15 App Router & Server Components:** Server Components by default across all layouts and placeholder pages, isolating Client Components exclusively to interactive boundaries (`ChatStudio.jsx`, `Navbar.jsx` mobile drawer, `SettingsClient.jsx`).
  - 📱 **Responsive Viewports at 375px & 1280px:** Mobile navigation drawer with touch targets at 375px; multi-column responsive grid with persistent telemetry at 1280px.
  - 🎨 **Base Design Tokens:** Configured in `tailwind.config.mjs` and `src/app/globals.css` with dark canvas palette (`#090d16`), card layers (`#0f172a`), brand primary (`#0284c7`), and typography tokens.
  - 🩺 **Live Health-Check Server Component:** `/health` dynamically fetches diagnostic telemetry from `/api/health`, rendering uptime, memory usage, sub-millisecond response latency, and subsystem integrity checks.
  - 🗺️ **Complete Routed Specification:** Every required screen scaffolded as a routed placeholder or interactive component (`/`, `/chat`, `/generative-ui`, `/multimodal`, `/workflows`, `/finops`, `/settings`, `/health`, `/api/health`).
- **Assignment Deliverables:**
  - [**`FlyRank_FE04_Capstone_Skeleton_Report.pdf`**](./FlyRank_FE04_Capstone_Skeleton_Report.pdf): Primary publication deliverable documenting App Router boundaries, design tokens, viewport benchmarks, and live data fetching.
  - [**`src/app/health/page.jsx`**](./src/app/health/page.jsx): Server Component fetching live diagnostic data.
  - [**`src/app/api/health/route.js`**](./src/app/api/health/route.js): Health API handler emitting JSON diagnostic payload.
  - [**`tests/routes.test.js`**](./tests/routes.test.js): Automated test suite verifying all routes, health contracts, responsive breakpoints, and zero-secrets invariants (14/14 tests passing).
  - [**`submission_notes_fe04.txt`**](./submission_notes_fe04.txt): Copy-paste portal submission notes.

### Week 3 (Foundations · 6h): React App Development with AI — PromptCraft Studio AI
- **Application Overview:** Built **PromptCraft Studio AI**, an interactive, enterprise-grade prompt engineering, dynamic variable interpolation, and heuristic quality evaluation studio built in React 19 + Vite 8.3 + Lucide Icons.
- **Key Features:**
  - 🔄 **Dynamic `{{variable}}` Extraction & Live Interpolation:** Automatically detects placeholders with non-greedy regex, generates reactive input controls, and compiles interpolated prompts in real time.
  - 📊 **Heuristic AI Quality Scorecard:** Evaluates prompt clarity (35%), specificity (35%), and constraint guardrails (30%) on a 0–100 scale, assigning quality tiers (`EXCELLENT`, `GOOD`, `MODERATE`, `POOR`) with actionable optimization recommendations.
  - ⚡ **Interactive Model Playground & Token Simulator:** Simulates token-by-token streaming generation (45ms interval) with abort control across Gemini 3.8 Flash High, Claude 3.7 Sonnet, and OpenAI GPT-4o.
  - 💰 **Real-Time Client FinOps Telemetry:** Calculates exact input/output token counts and transaction costs in USD down to 6 decimal places.
  - 💾 **Persistent Template Management:** Pre-seeded with 4 domain templates (Coding, Compliance, Analysis, System), featuring CRUD, filtering, cloning, and JSON export/import with `localStorage` persistence.
- **Assignment Deliverables:**
  - [**`PROMPTS.md`**](./PROMPTS.md): Complete chronological log of structured, constraint-driven prompts used across all 5 development phases.
  - [**`AI_ASSISTANCE.md`**](./AI_ASSISTANCE.md): In-depth analysis of how Google Antigravity (Gemini 3.8 Flash High) accelerated architectural planning, utility logic, UI scaffolding, and test generation (~6x velocity gain).
  - [**`REFACTORING.md`**](./REFACTORING.md): Detailed post-AI code review documentation detailing 4 critical manual refactorings (streaming timer memory leak cleanup, regex deduplication, schema property desynchronization, test environment decoupling).
  - [**`FlyRank_Week3_React_AI_App_Report.pdf`**](./FlyRank_Week3_React_AI_App_Report.pdf): Publication-grade dossier documenting architecture, test results, and mentorship alignment.
  - [**`tests/promptcraft.test.js`**](./tests/promptcraft.test.js): Automated test suite with 10/10 passing tests (`npm test`).

### Week 2 (FE-03 · 4h · Foundations): The AI-Assisted Workflow Drill
- [**`WORKFLOW.md`**](./WORKFLOW.md): Comparative analysis (490 words) contrasting unguided generation (Round 1) vs. specification-directed AI pairing (Round 2) across correctness, accessibility, and edge cases.
- [**Round 1 Branch (`workflow/round-one-vague`)**](https://github.com/KMSiam/Flyrank-Internship-Front-end-AI-Engineering/tree/workflow/round-one-vague): Form built via vague prompt with uncoordinated `useState` hooks, missing ARIA attributes, and boundary vulnerabilities.
- [**Round 2 Branch (`workflow/round-two-precise`)**](https://github.com/KMSiam/Flyrank-Internship-Front-end-AI-Engineering/tree/workflow/round-two-precise): Form built via precise specification with `react-hook-form`, `zodResolver`, strict WCAG 2.1 AA markup, and 9/9 passing automated unit tests (`npm test`).
- [**`FlyRank_FE03_Workflow_Drill_Report.pdf`**](./FlyRank_FE03_Workflow_Drill_Report.pdf): Publication-quality engineering report detailing the 497-line diff, AI mistakes caught, and velocity metrics.

### Week 1 (FE-01 · 3h · Setup): Environment and AI Toolchain
- [**`FlyRank_FE01_Environment_Toolchain_Report.pdf`**](./FlyRank_FE01_Environment_Toolchain_Report.pdf): Toolchain verification dossier covering Node.js LTS v24, Git, Claude Code, and Cursor.
- [**`CLAUDE.md`**](./CLAUDE.md): Claude Code pairing guidelines, stack specifications, and 3 project rules learned from FE-03.
- [**`.cursorrules`**](./.cursorrules): Cursor IDE configuration and `.cursor/rules/frontend-ai.mdc`.
- [**`screenshot_claude_code.png`**](./screenshot_claude_code.png): Terminal screenshot of Claude Code executing tasks in the environment.

---

## 6. Repository Structure

```text
Flyrank-Internship-Front-end-AI-Engineering/
├── .cursor/
│   └── rules/
│       └── frontend-ai.mdc         # Cursor IDE rules in MDC format
├── .cursorrules                     # Cursor rules configuration
├── .gitignore                       # Multi-framework ignore rules (Node, Next, Vite)
├── BUILDLOG.md                      # AI engineering diary and critique log
├── CLAUDE.md                        # Claude Code operating guidelines and stack standards
├── EVIDENCE.md                      # Assignment verification dossier and test proofs
├── LICENSE                          # MIT Open Source License
├── package.json                     # Root configuration, scripts, and dependencies
├── README.md                        # Primary project documentation (this file)
└── docs/
    └── screenshots/                 # AI assistant execution verification screenshots
```

---

## 6. Git Commit Protocol (Conventional Commits 1.0.0)

Every commit in this repository follows strict [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format:

| Type | Intent | Example |
| :--- | :--- | :--- |
| `feat` | New user-facing feature or component | `feat(chat): add auto-scrolling message list` |
| `fix` | Bug fix in code or logic | `fix(stream): prevent memory leak on abort` |
| `docs` | Documentation changes only | `docs(readme): add toolchain verification matrix` |
| `style` | Formatting, whitespace, semicolon fixes | `style(ui): reorder tailwind utility classes` |
| `refactor` | Code restructuring without behavior changes | `refactor(hooks): extract useAIStream hook` |
| `test` | Adding or updating unit/E2E test suites | `test(chat): verify stream termination on error` |
| `chore` | Maintenance, dependencies, tooling updates | `chore(deps): update vercel ai sdk to v4` |

---

## 7. AI Assistant Configuration & Governance

This repository is engineered using **Google Antigravity (Powered by Gemini 3.8 Flash High)** with complete multi-assistant interoperability:
- **[`AGY.md`](./AGY.md):** Primary Google Antigravity architecture guidelines, agentic conventions, and 3 project rules from FE-03.
- **[`CLAUDE.md`](./CLAUDE.md):** Claude Code configuration mirror ensuring cross-platform evaluator compatibility.
- **[`.cursorrules`](./.cursorrules):** Cursor IDE configuration mirror (`.cursor/rules/frontend-ai.mdc`).
- **[`BUILDLOG.md`](./BUILDLOG.md):** Captures engineering prompts, AI critique sessions, and architectural pivots across milestones.
- **[`EVIDENCE.md`](./EVIDENCE.md):** Documents verifiable execution outputs and validation criteria.

---

## 8. License

This project is licensed under the [MIT License](./LICENSE) &copy; 2026 KM Siam.
