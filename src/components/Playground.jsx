import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, RefreshCw, Cpu, Zap, Activity } from 'lucide-react';
import { interpolatePrompt, estimateTokens, calculateEstimatedCost, MODEL_PRICING } from '../utils/promptParser.js';

export function Playground({ template, variables }) {
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputStream, setOutputStream] = useState('');
  const [telemetry, setTelemetry] = useState(null);

  const streamTimerRef = useRef(null);
  const startTimeRef = useRef(0);

  // Clean up timer on unmount or active template change
  useEffect(() => {
    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, [template?.id]);

  const compiledPrompt = interpolatePrompt(template?.templateText || '', variables);
  const promptTokens = estimateTokens(compiledPrompt);

  const handleSimulateExecution = () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setOutputStream('');
    setTelemetry(null);
    startTimeRef.current = Date.now();

    // Sample generated response tailored to template category
    let mockResponse = '';
    if (template?.category === 'Compliance') {
      mockResponse = `{\n  "risk_level": "CRITICAL",\n  "compliance_score": 28,\n  "flagged_issue": "Uncapped unilateral indemnification and non-compliant 90-day breach notification window (violates GDPR Art. 33 <= 72h).",\n  "suggested_redline": "Customer agrees to defend and indemnify Vendor capped at aggregate fees paid in the preceding 12 months. Vendor shall notify Customer of confirmed breaches without undue delay and in any event within seventy-two (72) hours."\n}`;
    } else if (template?.category === 'Coding') {
      mockResponse = `### Step-by-Step Architecture Breakdown\n\n1. **Component Boundary Isolation**: Encapsulate the streaming chat panel into a dedicated Client Component with auto-scroll threshold detection.\n2. **State Management**: Leverage Zustand for persistent chat threads and optimistic message insertion.\n3. **Abortion Control**: Pass an \`AbortController.signal\` to the streaming completion fetch call.\n\n\`\`\`typescript\n// Auto-scrolling chat panel hook\nexport function useAutoScroll(dependencies: any[]) {\n  const scrollRef = useRef<HTMLDivElement>(null);\n  useEffect(() => {\n    if (scrollRef.current) {\n      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;\n    }\n  }, dependencies);\n  return scrollRef;\n}\n\`\`\``;
    } else if (template?.category === 'System') {
      mockResponse = `{\n  "order_id": "ORD-9021",\n  "customer_name": "John Doe",\n  "line_items": [\n    { "item": "widget", "qty": 3, "unit_price": 12.50 }\n  ],\n  "shipping": {\n    "method": "priority_overnight",\n    "city": "Seattle",\n    "state": "WA"\n  }\n}`;
    } else {
      mockResponse = `Based on the system instructions and provided parameters, here is the structured analysis:\n\n1. **Primary Synthesis**: The prompt successfully enforces clear boundaries and defines contextual variables.\n2. **Optimization Recommended**: Transition repetitive guidelines into few-shot examples to decrease input token consumption by ~18%.\n3. **Production Readiness**: Ready for deployment with schema-gated response validation.`;
    }

    const words = mockResponse.split(' ');
    let currentIndex = 0;

    streamTimerRef.current = setInterval(() => {
      if (currentIndex < words.length) {
        setOutputStream((prev) => (prev ? prev + ' ' + words[currentIndex] : words[currentIndex]));
        currentIndex++;
      } else {
        clearInterval(streamTimerRef.current);
        const elapsedMs = Date.now() - startTimeRef.current;
        const completionTokens = estimateTokens(mockResponse);
        const costUsd = calculateEstimatedCost(promptTokens, completionTokens, selectedModel);

        setTelemetry({
          latencyMs: elapsedMs,
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
          costUsd
        });
        setIsGenerating(false);
      }
    }, 45); // Smooth 45ms token emission rate
  };

  const handleStopExecution = () => {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    setIsGenerating(false);
    const elapsedMs = Date.now() - startTimeRef.current;
    const completionTokens = estimateTokens(outputStream);
    const costUsd = calculateEstimatedCost(promptTokens, completionTokens, selectedModel);

    setTelemetry({
      latencyMs: elapsedMs,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      costUsd
    });
  };

  return (
    <div style={{
      background: '#111827',
      border: '1px solid #1f2937',
      borderRadius: 10,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Cpu size={16} color="#0284c7" />
          AI Execution Playground &amp; Model Simulator
        </h3>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Simulates streaming token generation &amp; real-time FinOps pricing
        </span>
      </div>

      {/* Model Controls Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
            Target Model:
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={isGenerating}
            style={{
              width: '100%',
              background: '#090d16',
              border: '1px solid #334155',
              borderRadius: 6,
              padding: '7px 10px',
              color: '#f8fafc',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          >
            <option value="gemini-3.8-flash">Google Antigravity · Gemini 3.8 Flash High ($0.15/1M)</option>
            <option value="claude-3-7-sonnet">Anthropic Claude 3.7 Sonnet ($3.00/1M)</option>
            <option value="gpt-4o">OpenAI GPT-4o ($2.50/1M)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
            Temperature: {temperature}
          </label>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            disabled={isGenerating}
            style={{ width: '100%', accentColor: '#0284c7' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
            Max Output Tokens: {maxTokens}
          </label>
          <input
            type="range"
            min="256"
            max="4096"
            step="128"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
            disabled={isGenerating}
            style={{ width: '100%', accentColor: '#0284c7' }}
          />
        </div>
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', gap: 10 }}>
        {!isGenerating ? (
          <button
            onClick={handleSimulateExecution}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 18px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Play size={15} />
            Execute AI Simulation
          </button>
        ) : (
          <button
            onClick={handleStopExecution}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 18px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Square size={15} />
            Stop Streaming
          </button>
        )}
      </div>

      {/* Streaming Output Box */}
      <div style={{
        background: '#090d16',
        border: '1px solid #1e293b',
        borderRadius: 8,
        padding: 16,
        minHeight: 180,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: 8, marginBottom: 12 }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={14} color={isGenerating ? '#34d399' : '#64748b'} />
            Model Response Stream {isGenerating && '(Streaming tokens...)'}
          </span>
          {telemetry && (
            <div style={{ display: 'flex', gap: 12, fontSize: '0.72rem', color: '#64748b' }}>
              <span>Latency: <strong style={{ color: '#38bdf8' }}>{telemetry.latencyMs}ms</strong></span>
              <span>Output: <strong style={{ color: '#34d399' }}>{telemetry.completionTokens} tokens</strong></span>
              <span>Cost: <strong style={{ color: '#f59e0b' }}>${telemetry.costUsd.toFixed(6)}</strong></span>
            </div>
          )}
        </div>

        <div style={{
          flex: 1,
          color: outputStream ? '#f1f5f9' : '#64748b',
          fontSize: '0.86rem',
          fontFamily: 'monospace',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {outputStream || 'Click "Execute AI Simulation" to run this prompt through the selected model and review the streaming response.'}
        </div>
      </div>
    </div>
  );
}
