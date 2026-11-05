import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, GitBranch } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-[#0b0f19] py-8 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Left Info */}
          <div className="flex flex-col items-center gap-1 md:items-start">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <span>FlyRank Frontend AI Engineering</span>
              <span>•</span>
              <span className="text-sky-400">FE-04 Capstone Skeleton</span>
            </div>
            <p className="text-slate-500">
              Architected for Vercel / Netlify preview deployments on every push. Zero secrets in repository.
            </p>
          </div>

          {/* Center Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <Link href="/" className="hover:text-slate-200 transition-colors">Overview</Link>
            <Link href="/chat" className="hover:text-slate-200 transition-colors">Chat</Link>
            <Link href="/generative-ui" className="hover:text-slate-200 transition-colors">GenUI</Link>
            <Link href="/multimodal" className="hover:text-slate-200 transition-colors">Vision</Link>
            <Link href="/workflows" className="hover:text-slate-200 transition-colors">Workflows</Link>
            <Link href="/finops" className="hover:text-slate-200 transition-colors">FinOps</Link>
            <Link href="/health" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              <Activity className="h-3 w-3 text-emerald-400" />
              <span>Health Status</span>
            </Link>
          </div>

          {/* Right Attribution */}
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-slate-700/60">
              Candidate: KM Siam
            </span>
            <span className="rounded-full bg-sky-950/40 px-2.5 py-1 text-[11px] font-medium text-sky-400 border border-sky-500/30">
              Google Antigravity
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
