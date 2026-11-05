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
