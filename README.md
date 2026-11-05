# FlyRank Frontend AI Engineering Track

![Track](https://img.shields.io/badge/Track-Frontend_AI_Engineering-blue.svg)
![Candidate](https://img.shields.io/badge/Engineer-KM_Siam-emerald.svg)
![Node.js](https://img.shields.io/badge/Node.js-v24.13.1_LTS-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x_Strict-blue.svg)
![AI Assistant](https://img.shields.io/badge/Toolchain-Claude_Code_&_Cursor-purple.svg)
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
| **Node.js** | `v24.13.1` (LTS) | Core JavaScript/TypeScript execution runtime |
| **npm** | `11.8.0` | Package manager and script lifecycle runner |
| **Git** | `2.55.0.windows.4` | Version control with Conventional Commits 1.0.0 |
| **Claude Code CLI** | `2.1.138` | Agentic terminal assistant for repo-wide code generation |
| **Cursor / VS Code** | Latest Stable | AI-first editor leveraging `.cursorrules` and LSP |
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

## 5. Repository Structure

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

This repository is pre-configured for autonomous pair programming with **Claude Code** and **Cursor**:
- **[`CLAUDE.md`](./CLAUDE.md):** Defines stack conventions, component architectures, forbidden patterns (`any`, unhandled promises), and operating guardrails for Claude Code CLI.
- **[`BUILDLOG.md`](./BUILDLOG.md):** Captures engineering prompts, AI critique sessions, and architectural pivots across milestones.
- **[`EVIDENCE.md`](./EVIDENCE.md):** Documents verifiable execution outputs and validation criteria.

---

## 8. License

This project is licensed under the [MIT License](./LICENSE) &copy; 2026 KM Siam.
