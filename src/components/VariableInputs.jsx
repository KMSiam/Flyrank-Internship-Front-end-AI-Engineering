import React, { useState } from 'react';
import { interpolatePrompt, extractVariables } from '../utils/promptParser.js';
import { Copy, Check, Eye } from 'lucide-react';

export function VariableInputs({ template, variables, onVariableChange }) {
  const [copied, setCopied] = useState(false);
  const detectedVars = extractVariables(template?.templateText || '');
  const compiledPrompt = interpolatePrompt(template?.templateText || '', variables);

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!template) return null;

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
      {/* Dynamic Variables Section */}
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
          Dynamic Prompt Variables ({detectedVars.length})
        </h3>

        {detectedVars.length === 0 ? (
          <div style={{ padding: '12px', background: '#090d16', border: '1px solid #1e293b', borderRadius: 6, color: '#64748b', fontSize: '0.82rem' }}>
            No dynamic variables detected. Insert placeholders like <code>&#123;&#123;input_data&#125;&#125;</code> in your prompt template above.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {detectedVars.map((varName) => (
              <div key={varName}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#38bdf8', marginBottom: 4, fontFamily: 'monospace' }}>
                  &#123;&#123;{varName}&#125;&#125;:
                </label>
                <input
                  type="text"
                  placeholder={`Value for ${varName}...`}
                  value={variables[varName] || ''}
                  onChange={(e) => onVariableChange(varName, e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid #334155',
                    borderRadius: 6,
                    padding: '8px 12px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Interpolation Preview */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>
            <Eye size={15} color="#0284c7" />
            <span>Live Interpolated Prompt Preview</span>
          </div>

          <button
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: copied ? '#065f46' : '#1e293b',
              color: copied ? '#34d399' : '#cbd5e1',
              border: copied ? '1px solid #059669' : '1px solid #334155',
              borderRadius: 6,
              padding: '5px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy Compiled Prompt'}
          </button>
        </div>

        <pre style={{
          background: '#090d16',
          border: '1px solid #1e293b',
          borderRadius: 6,
          padding: 14,
          fontSize: '0.82rem',
          color: '#e2e8f0',
          fontFamily: 'monospace',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: 220,
          overflowY: 'auto',
          margin: 0
        }}>
          {compiledPrompt}
        </pre>
      </div>
    </div>
  );
}
