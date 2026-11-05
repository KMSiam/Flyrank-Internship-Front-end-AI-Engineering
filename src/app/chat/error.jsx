'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, MessageSquare } from 'lucide-react';
import Link from 'next/link';

/**
 * Route-Specific Error Boundary for /chat (FE-08).
 * Catches route-level rendering crashes and provides immediate retry.
 */
export default function ChatRouteError({ error, reset }) {
  useEffect(() => {
    console.error('Chat Route Error boundary caught an exception:', error);
  }, [error]);

  return (
    <div className="min-h-[500px] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-[#0f172a] p-6 sm:p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-950/60 border border-red-500/30 text-red-400">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 mb-2">
          Chat Route Boundary (chat/error.jsx)
        </span>

        <h2 className="text-xl font-bold text-white mb-2">Chat Route Crashed</h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          {error?.message || 'The conversational studio encountered an unrecoverable rendering exception. Click below to recover state.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-500 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Chat Interface</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-[#1e293b]/60 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#1e293b] transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
