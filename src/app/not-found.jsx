import React from 'react';
import Link from 'next/link';
import { Compass, Home, ArrowLeft } from 'lucide-react';

/**
 * Designed 404 Not Found Page (FE-08).
 * Provides actionable navigation links instead of dead-end white screens.
 */
export default function NotFound() {
  return (
    <div className="min-h-[500px] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl border border-border bg-[#0f172a] p-6 sm:p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-950/60 border border-sky-500/30 text-sky-400">
          <Compass className="h-7 w-7" />
        </div>

        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-2">
          HTTP 404 · Route Not Found
        </span>

        <h2 className="text-xl font-bold text-white mb-2">Screen Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          The requested capstone view or API endpoint does not exist. Explore the active routed screens below.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-500 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Overview Dashboard</span>
          </Link>
          <Link
            href="/chat"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-[#1e293b]/60 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#1e293b] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Streaming Chat Studio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
