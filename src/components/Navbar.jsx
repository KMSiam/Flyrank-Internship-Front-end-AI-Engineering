'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Menu,
  X,
  Activity,
  MessageSquare,
  LayoutGrid,
  Eye,
  GitBranch,
  Coins,
  Settings,
  ShieldCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: LayoutGrid },
  { href: '/chat', label: 'Streaming Chat', icon: MessageSquare },
  { href: '/generative-ui', label: 'Generative UI', icon: Sparkles },
  { href: '/multimodal', label: 'Vision & Canvas', icon: Eye },
  { href: '/workflows', label: 'Workflows', icon: GitBranch },
  { href: '/finops', label: 'FinOps & Billing', icon: Coins },
  { href: '/settings', label: 'AI Settings', icon: Settings },
  { href: '/health', label: 'Health Status', icon: Activity },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-[#090d16]/95 backdrop-blur supports-[backdrop-filter]:bg-[#090d16]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-sky-500 shadow-sm shadow-primary/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white sm:text-lg">
                FlyRank AI Studio
              </span>
              <span className="hidden font-mono text-[10px] text-sky-400 sm:inline-block sm:ml-2 rounded border border-sky-500/30 bg-sky-950/40 px-1.5 py-0.5">
                v1.0-preview
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 xl:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/15 text-sky-400 border border-primary/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Badges & Controls */}
        <div className="flex items-center gap-2">
          {/* Engine Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Google Antigravity</span>
          </div>

          {/* GitHub Repo */}
          <a
            href="https://github.com/KMSiam/Flyrank-Internship-Front-end-AI-Engineering"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="GitHub Repository"
          >
            <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Mobile Hamburger Toggle (375px viewports) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex rounded-lg border border-border p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white xl:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer (Optimized for 375px mobile screens) */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-[#0d1322] px-4 py-4 xl:hidden">
          <div className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-lg p-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/20 text-sky-400 border border-primary/40 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Responsive at 375px & 1280px</span>
            <span className="text-emerald-400">Online & Verified</span>
          </div>
        </div>
      )}
    </header>
  );
}
