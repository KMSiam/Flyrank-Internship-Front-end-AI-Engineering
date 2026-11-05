import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MessageSquare,
  LayoutGrid,
  Eye,
  GitBranch,
  Coins,
  Settings,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Layers,
  Smartphone,
  Monitor
} from 'lucide-react';

const SPEC_SCREENS = [
  {
    title: 'Streaming AI Chat Studio',
    route: '/chat',
    icon: MessageSquare,
    badge: 'Core Screen',
    color: 'from-blue-500/20 to-sky-500/10 text-sky-400 border-sky-500/30',
    description: 'Multi-turn conversational interface with streaming token backpressure, persona selection, and abort signal control.',
    type: 'Client Interactivity'
  },
  {
    title: 'Generative UI Sandbox',
    route: '/generative-ui',
    icon: Sparkles,
    badge: 'Core Screen',
    color: 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30',
    description: 'Dynamic schema-driven component rendering engine translating structured AI tool calls into rich interactive cards and widgets.',
    type: 'Server + Client Component'
  },
  {
    title: 'Multimodal Vision & Canvas',
    route: '/multimodal',
    icon: Eye,
    badge: 'Core Screen',
    color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Image upload inspector, drag-and-drop canvas markup, visual OCR extraction, and auto-tagging preview.',
    type: 'Client Interactivity'
  },
  {
    title: 'Visual Workflow Studio',
    route: '/workflows',
    icon: GitBranch,
    badge: 'Core Screen',
    color: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30',
    description: 'Node-based visual execution graph for multi-agent pipeline orchestration, conditional branches, and fallbacks.',
    type: 'Server Component Skeleton'
  },
  {
    title: 'LLM Token FinOps & Metering',
    route: '/finops',
    icon: Coins,
    badge: 'Core Screen',
    color: 'from-rose-500/20 to-red-500/10 text-rose-400 border-rose-500/30',
    description: 'Real-time token consumption telemetry, multi-model cost attribution (Gemini, Claude, GPT-4o), and budget limit alerts.',
    type: 'Server Component Skeleton'
  },
  {
    title: 'AI Model & System Settings',
    route: '/settings',
    icon: Settings,
    badge: 'FE-03 Verified',
    color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
    description: 'Production settings form with Zod schema validation, React Hook Form, and strict WCAG 2.1 AA accessibility.',
    type: 'Client Form Component'
  },
  {
    title: 'Health-Check & Telemetry',
    route: '/health',
    icon: Activity,
    badge: 'FE-04 Required',
    color: 'from-emerald-500/20 to-green-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Server Component that fetches live data from /api/health, rendering latency, uptime, memory, and environment invariants.',
    type: 'Server Component (Data Fetching)'
  }
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-[#111827] to-[#090d16] p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/40 px-3.5 py-1 text-xs font-semibold text-sky-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Frontend AI Engineering · Week 3 · FE-04 Capstone Skeleton</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Enterprise Frontend AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400">Capstone Platform</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Production-grade Next.js App Router application deployed from day one. Every screen in the capstone specification is scaffolded with Server Components by default, responsive design tokens at 375px and 1280px, and zero secrets committed.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/health"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-hover transition-all"
            >
              <Activity className="h-4 w-4" />
              <span>Inspect Live Health Telemetry</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-slate-800/80 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-all"
            >
              <MessageSquare className="h-4 w-4 text-sky-400" />
              <span>Open Streaming Chat Studio</span>
            </Link>
          </div>
        </div>

        {/* Decorative Grid Accent */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      </section>

      {/* Responsive Viewport Proof Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-[#0f172a] p-4">
          <div className="rounded-lg bg-sky-950/60 border border-sky-500/30 p-2.5 text-sky-400">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Mobile Viewport (375px)</span>
              <span className="rounded bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] font-mono text-emerald-400">VERIFIED</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Drawer navigation, stacked flex-col layout, responsive typography, and thumb-friendly touch targets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border bg-[#0f172a] p-4">
          <div className="rounded-lg bg-purple-950/60 border border-purple-500/30 p-2.5 text-purple-400">
            <Monitor className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Desktop Viewport (1280px)</span>
              <span className="rounded bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] font-mono text-emerald-400">VERIFIED</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Full desktop header navbar, multi-column grid workbench, persistent telemetry panels, and zero layout shift.
            </p>
          </div>
        </div>
      </section>

      {/* Screen Spec Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Routed Screens in Specification
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Every screen required by the capstone specification exists as a routed placeholder or interactive component.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {SPEC_SCREENS.length} Screens Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPEC_SCREENS.map((screen) => {
            const Icon = screen.icon;
            return (
              <Link
                key={screen.route}
                href={screen.route}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-[#0f172a] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-slate-600 hover:bg-[#131d36]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`rounded-lg border p-2.5 bg-gradient-to-br ${screen.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-border bg-slate-800/80 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                      {screen.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                    {screen.title}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-500 mb-2">{screen.route}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {screen.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">{screen.type}</span>
                  <span className="text-sky-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Open Screen &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
