'use client';

import React from 'react';
import { AlertCircle, RotateCcw, ShieldAlert, Terminal, Wrench } from 'lucide-react';

export function ToolErrorCard({ error, onRetry }) {
  const errorCode = error?.code || 'ERR_TOOL_EXECUTION_FAILED';
  const errorMessage = error?.message || 'The tool encountered an unhandled boundary condition during execution.';
  const suggestedAction = error?.suggestedAction || 'Ensure your prompt supplies explicit system personas and output format boundaries.';

  return (
    <div className="w-full rounded-2xl border border-rose-500/40 bg-rose-950/20 p-5 shadow-2xl space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rose-500/30 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-950 border border-rose-500/50 text-rose-400">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-rose-300 uppercase tracking-wider">
              Designed Tool Error Boundary
            </h4>
            <div className="text-[10px] text-rose-400/80 font-mono">
              Tool: scorePromptEngineering
            </div>
          </div>
        </div>

        <span className="rounded-full border border-rose-500/40 bg-rose-950/60 px-2.5 py-0.5 text-[10px] font-bold font-mono text-rose-400">
          {errorCode}
        </span>
      </div>

      {/* Description */}
      <div className="space-y-2 text-xs">
        <p className="text-rose-200 leading-relaxed font-medium">
          {errorMessage}
        </p>

        <div className="rounded-lg bg-[#090d16] p-3 border border-rose-900/60 text-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
            <Wrench className="h-3.5 w-3.5" />
            <span>Recommended Remediation:</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {suggestedAction}
          </p>
        </div>
      </div>

      {/* Retry Action */}
      <div className="flex items-center justify-between pt-2 border-t border-rose-900/40">
        <span className="text-[10px] text-rose-400/70 font-mono">Status: Recoverable Error</span>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retry Tool Execution</span>
          </button>
        )}
      </div>
    </div>
  );
}
