import React from 'react';
import { GitBranch, Play, CheckCircle2, AlertTriangle, ArrowRight, Zap, Database, Cpu, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Visual Workflow Studio — FlyRank Frontend AI',
  description: 'Node-based visual execution graph for multi-agent pipeline orchestration and stateful branching logic.',
};

const NODES = [
  {
    id: 'node-1',
    title: 'Trigger: User Ingestion',
    type: 'Input Event',
    icon: Zap,
    color: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
    status: 'COMPLETE',
    latency: '12ms',
    details: 'Webhook payload parsed and schema-validated'
  },
  {
    id: 'node-2',
    title: 'Context Enrichment (RAG)',
    type: 'Data Retrieval',
    icon: Database,
    color: 'text-sky-400 bg-sky-950/40 border-sky-500/30',
    status: 'COMPLETE',
    latency: '45ms',
    details: 'Vector similarity search matched 3 relevant chunks'
  },
  {
    id: 'node-3',
    title: 'LLM Multi-Turn Reasoning',
    type: 'Inference',
    icon: Cpu,
    color: 'text-purple-400 bg-purple-950/40 border-purple-500/30',
    status: 'ACTIVE',
    latency: '180ms',
    details: 'Gemini 3.8 Flash streaming token completion'
  },
  {
    id: 'node-4',
    title: 'Guardrail & Output Validation',
    type: 'Verification',
    icon: ShieldCheck,
    color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    status: 'QUEUED',
    latency: '--',
    details: 'Zod boundary verification before dispatch'
  }
];

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <GitBranch className="h-4 w-4" />
          <span>Core Capstone Screen · Screen 4</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Visual Agentic Workflow Studio
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Stateful agent orchestration pipeline graph with conditional branch routing, retrieval augmentation, and guardrail validation.
        </p>
      </div>

      {/* Visual Pipeline Canvas */}
      <div className="rounded-xl border border-border bg-[#0f172a] p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-200">Execution Graph: Pipeline #AGY-804</h2>
            <div className="text-xs text-slate-500 font-mono mt-0.5">Mode: Concurrent DAG · 4 Nodes</div>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover transition-colors">
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>Re-execute Pipeline</span>
          </button>
        </div>

        {/* Node Sequence Display */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {NODES.map((node, idx) => {
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                className="relative rounded-xl border border-border bg-[#090d16] p-4 flex flex-col justify-between hover:border-slate-600 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg border ${node.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                      node.status === 'COMPLETE'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : node.status === 'ACTIVE'
                        ? 'bg-sky-950/60 text-sky-400 border border-sky-500/30 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {node.status}
                    </span>
                  </div>

                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">{node.type}</div>
                  <h3 className="text-sm font-bold text-white mt-0.5">{node.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {node.details}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Latency:</span>
                  <span className="text-slate-300 font-semibold">{node.latency}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
