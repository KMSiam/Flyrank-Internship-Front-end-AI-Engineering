'use client';

import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, Zap, Crosshair, BarChart3, Clock, Tag } from 'lucide-react';

export function PromptScoreCard({ result }) {
  if (!result) return null;

  const {
    overallScore = 85,
    gradeTier = 'EXCELLENT',
    targetDomain = 'coding',
    strictMode = true,
    dimensions = { clarity: 85, specificity: 80, guardrails: 90 },
    estimatedTokens = 24,
    estimatedLatencyMs = 42,
    recommendations = []
  } = result;

  const getTierStyles = (tier) => {
    switch (tier) {
      case 'EXCELLENT':
        return { badge: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40', bar: 'bg-emerald-500' };
      case 'GOOD':
        return { badge: 'bg-sky-950/60 text-sky-400 border-sky-500/40', bar: 'bg-sky-500' };
      case 'MODERATE':
        return { badge: 'bg-amber-950/60 text-amber-400 border-amber-500/40', bar: 'bg-amber-500' };
      default:
        return { badge: 'bg-rose-950/60 text-rose-400 border-rose-500/40', bar: 'bg-rose-500' };
    }
  };

  const tierStyle = getTierStyles(gradeTier);

  return (
    <div className="w-full rounded-2xl border border-border bg-[#090d16] p-5 shadow-2xl space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-950/80 border border-sky-500/30 text-sky-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Tool Result: Prompt Quality Scorecard
            </h4>
            <div className="text-[10px] text-slate-400 font-mono">
              scorePromptEngineering • Domain: {targetDomain}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold font-mono ${tierStyle.badge}`}>
            {gradeTier} ({overallScore}/100)
          </span>
        </div>
      </div>

      {/* Main Score & Dimension Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Clarity */}
        <div className="rounded-xl border border-border bg-[#0f172a] p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-blue-400" />
              <span>Clarity</span>
            </span>
            <span className="font-mono text-white font-bold">{dimensions.clarity}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${dimensions.clarity}%` }} />
          </div>
        </div>

        {/* Specificity */}
        <div className="rounded-xl border border-border bg-[#0f172a] p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Crosshair className="h-3.5 w-3.5 text-purple-400" />
              <span>Specificity</span>
            </span>
            <span className="font-mono text-white font-bold">{dimensions.specificity}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${dimensions.specificity}%` }} />
          </div>
        </div>

        {/* Guardrails */}
        <div className="rounded-xl border border-border bg-[#0f172a] p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Guardrails</span>
            </span>
            <span className="font-mono text-white font-bold">{dimensions.guardrails}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${dimensions.guardrails}%` }} />
          </div>
        </div>
      </div>

      {/* Hand-Rolled SVG Bar Chart Comparison */}
      <div className="rounded-xl border border-border bg-[#0f172a] p-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-3">
          <span className="flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-sky-400" />
            <span>Dimension Score Comparison</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Weighting: 35% / 35% / 30%</span>
        </div>

        <div className="h-16 flex items-end justify-around gap-4 pt-2 border-b border-border/80">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full bg-blue-500 rounded-t transition-all duration-500" style={{ height: `${dimensions.clarity * 0.45}px` }} />
            <span className="text-[10px] font-mono text-slate-400">Clarity</span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full bg-purple-500 rounded-t transition-all duration-500" style={{ height: `${dimensions.specificity * 0.45}px` }} />
            <span className="text-[10px] font-mono text-slate-400">Specificity</span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full bg-emerald-500 rounded-t transition-all duration-500" style={{ height: `${dimensions.guardrails * 0.45}px` }} />
            <span className="text-[10px] font-mono text-slate-400">Guardrails</span>
          </div>
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Actionable Optimizations
        </div>
        <div className="space-y-1.5">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2 rounded-lg bg-[#0f172a] p-2.5 text-xs text-slate-300 border border-border/60">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Telemetry */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-border">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Execution Latency: {estimatedLatencyMs}ms</span>
        </span>
        <span>Tokens: ~{estimatedTokens}</span>
      </div>
    </div>
  );
}
