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
