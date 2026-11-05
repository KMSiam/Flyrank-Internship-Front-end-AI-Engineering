'use client';

import React, { useState } from 'react';
import { SmartButton } from '../../components/ui/SmartButton';
import { Sparkles, Layers, Sliders, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

export default function MicroInteractionsPage() {
  const [testMode, setTestMode] = useState('random'); // 'random' | 'success' | 'error'
  const [log, setLog] = useState([]);

  const addLog = (msg) => {
    setLog(prev => [
      { id: Date.now(), text: msg, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 5)
    ]);
  };

  const handleAction = async (forced) => {
    addLog(`Action initiated (Trigger: ${forced || testMode})...`);
    await new Promise(r => setTimeout(r, 750));
    const effective = forced || testMode;
    if (effective === 'error' || (effective === 'random' && Math.random() < 0.2)) {
      addLog('Action failed! Button transitioned to Error state.');
      throw new Error('Action failed');
    }
    addLog('Action succeeded! Button transitioned to Success state.');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
          <Sparkles className="h-4 w-4" />
          <span>Week 6 · FE-AA1 Micro-interactions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Buttons with a Brain: Motion & State Micro-interactions
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Intentional state choreography across 6 distinct states: Idle → Hover/Focus → Loading → Success / Error → Rollback to Idle.
        </p>
      </div>

      {/* Interactive Testing Workbench */}
      <div className="rounded-2xl border border-border bg-[#0f172a] p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border mb-6">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
            <Sliders className="h-4 w-4 text-sky-400" />
            <span>Sabotage / Outcome Control:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setTestMode('random')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                testMode === 'random'
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Random (20% Fail)
            </button>
            <button
              type="button"
              onClick={() => setTestMode('success')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                testMode === 'success'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Force Success (100%)
            </button>
            <button
              type="button"
              onClick={() => setTestMode('error')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                testMode === 'error'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Force Error (100%)
            </button>
          </div>
        </div>

        {/* Demo Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center py-4">
          {/* Button 1: Primary Chat Sender */}
          <div className="p-5 rounded-xl border border-border bg-[#162036] flex flex-col items-center text-center">
            <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider mb-2">
              Primary System Button
            </span>
            <h3 className="text-sm font-semibold text-white mb-1">Send Message (Chat Co-Pilot)</h3>
            <p className="text-xs text-slate-400 mb-5">
              Slides from label to spinner, morphs to checkmark or shakes into retry state.
            </p>

            <SmartButton
              label="Send Message"
              loadingLabel="Synthesizing..."
              successLabel="Sent to Stream"
              errorLabel="Retry Message"
              variant="primary"
              onAction={handleAction}
              forcedResult={testMode === 'random' ? null : testMode}
            />
          </div>

          {/* Button 2: Secondary Generator (Proving the System) */}
          <div className="p-5 rounded-xl border border-border bg-[#162036] flex flex-col items-center text-center">
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2">
              Secondary System Button
            </span>
            <h3 className="text-sm font-semibold text-white mb-1">Generate Audit (Generative UI)</h3>
            <p className="text-xs text-slate-400 mb-5">
              Shares identical motion grammar, easing curves, and keyboard/a11y contracts.
            </p>

            <SmartButton
              label="Run Audit"
              loadingLabel="Executing Tool..."
              successLabel="Scorecard Ready"
              errorLabel="Retry Audit"
              variant="secondary"
              onAction={handleAction}
              forcedResult={testMode === 'random' ? null : testMode}
            />
          </div>
        </div>

        {/* Event Logs */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between">
            <span>Real-time State Transition Log:</span>
            <span>Interruptible & Debounced</span>
          </div>
          <div className="bg-[#090d16] rounded-xl p-3 border border-border font-mono text-[11px] text-slate-300 min-h-[70px] space-y-1">
            {log.length === 0 ? (
              <span className="text-slate-500 italic">Click a button above to observe state transitions.</span>
            ) : (
              log.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="text-slate-500">[{item.time}]</span>
                  <span>{item.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Motion & Easing Design Rationale */}
      <div className="rounded-2xl border border-border bg-[#0f172a] p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="h-4 w-4 text-sky-400" />
          <span>Motion Design & Easing Rationale (FE-AA1 Spec)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl border border-border bg-[#162036]">
            <strong className="text-sky-400 block mb-1">1. Duration: 200ms</strong>
            <p className="text-slate-400 leading-relaxed">
              Fast enough to feel instantaneous without abrupt clipping. Micro-interactions beyond 300ms feel sluggish to power users.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-[#162036]">
            <strong className="text-emerald-400 block mb-1">2. Easing: ease-out & cubic-bezier</strong>
            <p className="text-slate-400 leading-relaxed">
              Standard state changes use <code>ease-out</code> for snappy starts with gentle landing. The error state uses <code>cubic-bezier(0.36, 0.07, 0.19, 0.97)</code> for physics-modeled shake.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-[#162036]">
            <strong className="text-amber-400 block mb-1">3. Compositor-Only & A11y</strong>
            <p className="text-slate-400 leading-relaxed">
              Animates only <code>transform</code> and <code>opacity</code> to prevent layout thrash (zero CLS). Honors <code>prefers-reduced-motion</code> by muting translations while preserving color state.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
