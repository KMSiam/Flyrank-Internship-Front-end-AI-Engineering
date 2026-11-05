'use client';

import React from 'react';
import { PromptScoreCard } from './PromptScoreCard';
import { ToolErrorCard } from './ToolErrorCard';
import { Loader2, Wrench, ArrowRight, Code2, Check, Sparkles } from 'lucide-react';

/**
 * ToolPartRenderer Component (FE-07).
 * Renders the full 4-state lifecycle machine for server-side tools:
 * 1. 'input-streaming' — What is it doing? (Shimmering spinner with live parameter telemetry)
 * 2. 'input-available' — With what input? (Structured argument inspector pill)
 * 3. 'output-available' — What came back? (Rich PromptScoreCard component)
 * 4. 'output-error' — What went wrong? (Designed ToolErrorCard with retry affordance)
 */
export function ToolPartRenderer({
  state = 'output-available', // 'input-streaming' | 'input-available' | 'output-available' | 'output-error'
  toolName = 'scorePromptEngineering',
  args = { promptText: 'Analyze frontend requirements', targetDomain: 'coding', strictMode: true },
  result = null,
  error = null,
  onRetry = null,
  onExecute = null
}) {
  return (
    <div className="w-full transition-all duration-200">
      {/* STATE 1: input-streaming (What is it doing?) */}
      {state === 'input-streaming' && (
        <div className="rounded-2xl border border-sky-500/40 bg-sky-950/20 p-5 space-y-3 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-sky-400 animate-spin" />
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                Tool Calling: {toolName}
              </span>
            </div>
            <span className="rounded bg-sky-950/60 border border-sky-500/40 px-2 py-0.5 text-[10px] font-mono text-sky-400">
              STATE: INPUT_STREAMING
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Streaming schema parameters to model gateway... Validating target domain heuristics.
          </p>

          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-400 w-2/3 animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>
      )}

      {/* STATE 2: input-available (With what input?) */}
      {state === 'input-available' && (
        <div className="rounded-2xl border border-purple-500/40 bg-purple-950/20 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-purple-900/60 pb-2.5">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                Tool Input Arguments Available
              </span>
            </div>
            <span className="rounded bg-purple-950/60 border border-purple-500/40 px-2 py-0.5 text-[10px] font-mono text-purple-400">
              STATE: INPUT_AVAILABLE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-[#090d16] border border-border">
              <span className="text-slate-500 text-[10px] block">Target Domain:</span>
              <span className="text-purple-300 font-bold">{args?.targetDomain || 'coding'}</span>
            </div>
            <div className="p-2 rounded bg-[#090d16] border border-border">
              <span className="text-slate-500 text-[10px] block">Strict Guardrails:</span>
              <span className="text-emerald-400 font-bold">{args?.strictMode ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 truncate bg-[#090d16] p-2 rounded border border-border font-mono">
            Prompt: &quot;{args?.promptText || ''}&quot;
          </div>

          {onExecute && (
            <button
              type="button"
              onClick={onExecute}
              className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
            >
              <span>Execute Tool Pipeline</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {/* STATE 3: output-available (What came back? Rendered as Rich Component) */}
      {state === 'output-available' && (
        <PromptScoreCard result={result} />
      )}

      {/* STATE 4: output-error (What went wrong? Designed Error Boundary) */}
      {state === 'output-error' && (
        <ToolErrorCard error={error} onRetry={onRetry} />
      )}
    </div>
  );
}
