'use client';

import React, { useState } from 'react';
import { ToolPartRenderer } from './ToolPartRenderer';
import { executePromptAudit } from '../../lib/tools/promptAuditTool';
import { Play, ShieldAlert, RotateCcw, CheckCircle2, Sparkles, Layers } from 'lucide-react';

export function ToolLifecycleDemo() {
  const [activeState, setActiveState] = useState('output-available');
  const [toolResult, setToolResult] = useState({
    success: true,
    toolName: 'scorePromptEngineering',
    timestamp: new Date().toISOString(),
    overallScore: 92,
    gradeTier: 'EXCELLENT',
    targetDomain: 'coding',
    strictMode: true,
    dimensions: { clarity: 95, specificity: 90, guardrails: 90 },
    estimatedTokens: 38,
    estimatedLatencyMs: 44,
    recommendations: [
      'Optimal prompt structure! Persona, schema constraints, and clear verb objectives verified.'
    ]
  });
  const [toolError, setToolError] = useState(null);

  const sampleArgs = {
    promptText: 'You are a principal engineer. Design an accessible streaming chat panel in Next.js 15.',
    targetDomain: 'coding',
    strictMode: true
  };

  // Run End-to-End Successful Tool Flow (input-streaming -> input-available -> output-available)
  const handleRunSuccessfulFlow = async () => {
    setToolError(null);
    setActiveState('input-streaming');

    setTimeout(() => {
      setActiveState('input-available');
      setTimeout(async () => {
        try {
          const res = await executePromptAudit(sampleArgs);
          setToolResult(res);
          setActiveState('output-available');
        } catch (err) {
          setToolError(err);
          setActiveState('output-error');
        }
      }, 700);
    }, 800);
  };

  // Trigger Designed Tool Error State
  const handleTriggerErrorFlow = async () => {
    setActiveState('input-streaming');

    setTimeout(async () => {
      try {
        await executePromptAudit({
          promptText: 'TRIGGER_TOOL_ERROR: missing context parameters',
          targetDomain: 'coding',
          strictMode: true
        });
      } catch (err) {
        setToolError({
          code: err.code || 'ERR_INSUFFICIENT_CONTEXT',
          message: err.message,
          suggestedAction: 'Ensure prompt provides a system persona and output format boundaries.'
        });
        setActiveState('output-error');
      }
    }, 700);
  };

  return (
    <div className="rounded-2xl border border-border bg-[#0f172a] p-6 space-y-6 shadow-xl">
      {/* Control Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span>Interactive Tool Lifecycle State Machine</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            FE-07: Testing all 4 typed tool parts with distinct visual treatments and designed error recovery.
          </p>
        </div>

        {/* State Selection Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'input-streaming', label: '1. Streaming' },
            { id: 'input-available', label: '2. Available' },
            { id: 'output-available', label: '3. Result' },
            { id: 'output-error', label: '4. Error' }
          ].map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveState(s.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition-colors ${
                activeState === s.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons for Reviewer */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleRunSuccessfulFlow}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
        >
          <Play className="h-3.5 w-3.5 fill-white" />
          <span>Run End-to-End Tool Call (Morph to Result)</span>
        </button>

        <button
          type="button"
          onClick={handleTriggerErrorFlow}
          className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/20"
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Trigger Tool Error (Test Error State)</span>
        </button>
      </div>

      {/* Rendered Tool Part with Smooth Crossfade */}
      <div className="min-h-[280px] flex items-center justify-center">
        <ToolPartRenderer
          state={activeState}
          toolName="scorePromptEngineering"
          args={sampleArgs}
          result={toolResult}
          error={toolError}
          onRetry={handleRunSuccessfulFlow}
          onExecute={handleRunSuccessfulFlow}
        />
      </div>
    </div>
  );
}
