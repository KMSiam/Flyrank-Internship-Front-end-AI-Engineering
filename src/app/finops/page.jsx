import React from 'react';
import { Coins, TrendingDown, DollarSign, Activity, AlertCircle, BarChart3, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'LLM Token FinOps & Governance — FlyRank Frontend AI',
  description: 'Real-time token metering, per-model USD cost attribution, and budget guardrails.',
};

const MODEL_COSTS = [
  {
    model: 'Gemini 3.8 Flash High',
    provider: 'Google DeepMind',
    promptTokens: '1,420,000',
    completionTokens: '680,000',
    totalCost: '$0.6210',
    share: '24%',
    color: 'bg-emerald-500'
  },
  {
    model: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    promptTokens: '450,000',
    completionTokens: '210,000',
    totalCost: '$4.5000',
    share: '58%',
    color: 'bg-sky-500'
  },
  {
    model: 'GPT-4o',
    provider: 'OpenAI',
    promptTokens: '620,000',
    completionTokens: '110,000',
    totalCost: '$2.6500',
    share: '18%',
    color: 'bg-purple-500'
  }
];

export default function FinOpsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400">
          <Coins className="h-4 w-4" />
          <span>Core Capstone Screen · Screen 5</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Client FinOps & Token Governance
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time inference telemetry, per-model cost attribution, token budget caps, and latency percentiles.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-[#0f172a] p-5">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Cumulative Spend (MTD)</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white">$7.7710</div>
          <div className="text-xs text-emerald-400 mt-1 font-semibold">12.4% below monthly $65 cap</div>
        </div>

        <div className="rounded-xl border border-border bg-[#0f172a] p-5">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Total Tokens Processed</span>
            <Activity className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white">3,490,000</div>
          <div className="text-xs text-slate-400 mt-1">2.49M Prompt · 1.00M Completion</div>
        </div>

        <div className="rounded-xl border border-border bg-[#0f172a] p-5">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Inference Latency (p95)</span>
            <BarChart3 className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white">412 ms</div>
          <div className="text-xs text-sky-400 mt-1">TTFT: 145ms average</div>
        </div>
      </div>

      {/* Per-Model Attribution Table */}
      <div className="rounded-xl border border-border bg-[#0f172a] p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Multi-Model Attribution Breakdown
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-slate-400 font-mono">
                <th className="pb-3 font-semibold">Model / Engine</th>
                <th className="pb-3 font-semibold">Provider</th>
                <th className="pb-3 font-semibold">Prompt Tokens</th>
                <th className="pb-3 font-semibold">Completion Tokens</th>
                <th className="pb-3 font-semibold">Total Cost (USD)</th>
                <th className="pb-3 font-semibold">Budget Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {MODEL_COSTS.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#131d36] transition-colors">
                  <td className="py-3 font-semibold text-white flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    {item.model}
                  </td>
                  <td className="py-3 text-slate-400">{item.provider}</td>
                  <td className="py-3 font-mono text-slate-300">{item.promptTokens}</td>
                  <td className="py-3 font-mono text-slate-300">{item.completionTokens}</td>
                  <td className="py-3 font-mono text-emerald-400 font-bold">{item.totalCost}</td>
                  <td className="py-3 font-mono text-slate-400">{item.share}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
