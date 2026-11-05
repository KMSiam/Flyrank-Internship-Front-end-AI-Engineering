import React from 'react';
import { Sparkles, Plane, TrendingUp, CheckCircle, Clock, ShieldCheck, Code2 } from 'lucide-react';

export const metadata = {
  title: 'Generative UI Sandbox — FlyRank Frontend AI',
  description: 'Schema-driven dynamic generative UI component rendering from structured AI tool calls.',
};

export default function GenerativeUIPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
          <Sparkles className="h-4 w-4" />
          <span>Core Capstone Screen · Screen 2</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Generative UI Sandbox
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Demonstrating schema-driven dynamic component synthesis. Structured LLM tool-call payloads are parsed and mapped directly into typed React components.
        </p>
      </div>

      {/* Grid of Dynamic Generative Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Card 1: Tool Call `displayFlightBooking` */}
        <div className="rounded-xl border border-border bg-[#0f172a] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-bold text-slate-200">Tool: displayFlightBooking</span>
            </div>
            <span className="rounded bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 text-[10px] font-mono text-sky-400">
              SCHEMA VERIFIED
            </span>
          </div>

          <div className="rounded-lg bg-[#090d16] p-4 border border-border">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Flight FR-402 · Non-stop</span>
              <span className="text-emerald-400 font-semibold">Confirmed</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-2xl font-bold font-mono text-white">DAC</div>
                <div className="text-xs text-slate-400">Dhaka (Hazrat Shahjalal)</div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-slate-500">4h 15m</span>
                <div className="w-24 h-0.5 bg-sky-500 relative my-1">
                  <Plane className="h-3 w-3 text-sky-400 absolute left-1/2 -top-1.5 -translate-x-1/2" />
                </div>
                <span className="text-[10px] text-emerald-400">Boeing 787-9</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-mono text-white">DXB</div>
                <div className="text-xs text-slate-400">Dubai International</div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Passenger: KM Siam</span>
              <span className="font-mono text-sky-400 font-bold">$420.00 USD</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
            <Code2 className="h-3.5 w-3.5" />
            <span>Rendered via Discriminated Union: type = 'flight_widget'</span>
          </div>
        </div>

        {/* Dynamic Card 2: Tool Call `renderFinancialSummary` */}
        <div className="rounded-xl border border-border bg-[#0f172a] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">Tool: renderFinancialSummary</span>
            </div>
            <span className="rounded bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
              STREAM SYNCHRONIZED
            </span>
          </div>

          <div className="rounded-lg bg-[#090d16] p-4 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Weekly LLM Inference Spend</span>
              <span className="text-xs text-emerald-400 font-semibold font-mono">-18.4% vs budget</span>
            </div>

            <div className="text-3xl font-black font-mono text-white">$14.28 <span className="text-xs text-slate-500 font-normal">/ $80.00 cap</span></div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-sky-500 h-full w-[18%]"></div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-2 rounded bg-[#0f172a]">
                <div className="text-[10px] text-slate-500">Gemini 3.8</div>
                <div className="font-mono text-slate-200 font-semibold">$3.82</div>
              </div>
              <div className="p-2 rounded bg-[#0f172a]">
                <div className="text-[10px] text-slate-500">Claude 3.7</div>
                <div className="font-mono text-slate-200 font-semibold">$8.12</div>
              </div>
              <div className="p-2 rounded bg-[#0f172a]">
                <div className="text-[10px] text-slate-500">GPT-4o</div>
                <div className="font-mono text-slate-200 font-semibold">$2.34</div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
            <Code2 className="h-3.5 w-3.5" />
            <span>Rendered via Discriminated Union: type = 'finops_chart'</span>
          </div>
        </div>
      </div>
    </div>
  );
}
