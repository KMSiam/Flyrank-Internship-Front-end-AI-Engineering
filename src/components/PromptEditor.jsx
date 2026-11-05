import React from 'react';
import { extractVariables, estimateTokens, calculateEstimatedCost } from '../utils/promptParser.js';
import { Code, Hash, Coins } from 'lucide-react';

export function PromptEditor({ template, onChange }) {
  if (!template) return null;

  const vars = extractVariables(template.templateText);
  const promptTokens = estimateTokens(template.templateText);
  const estCost = calculateEstimatedCost(promptTokens, 350, 'gemini-3.8-flash');

  const handleFieldChange = (field, value) => {
    onChange({
      ...template,
      [field]: value
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
      {/* Title & Category Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
            Template Name / Identifier:
          </label>
          <input
            type="text"
            value={template.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            style={{
              width: '100%',
              background: '#090d16',
              border: '1px solid #334155',
              borderRadius: 6,
              padding: '8px 12px',
              color: '#f8fafc',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
            Category:
          </label>
          <select
            value={template.category}
            onChange={(e) => handleFieldChange('category', e.target.value)}
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
          >
            <option value="Coding">Coding</option>
            <option value="Compliance">Compliance</option>
            <option value="Analysis">Analysis</option>
            <option value="Creative">Creative</option>
            <option value="System">System</option>
          </select>
        </div>
      </div>

      {/* System Role / Instructions */}
      <div>
        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
          System Persona / Pre-Prompt:
        </label>
        <input
          type="text"
          value={template.systemRole || ''}
          onChange={(e) => handleFieldChange('systemRole', e.target.value)}
          placeholder="e.g. You are a senior frontend engineer specializing in Next.js 15."
          style={{
            width: '100%',
            background: '#090d16',
            border: '1px solid #334155',
            borderRadius: 6,
            padding: '8px 12px',
            color: '#cbd5e1',
            fontSize: '0.85rem',
            outline: 'none'
          }}
        />
      </div>

      {/* Template Prompt Body */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8' }}>
            Prompt Template Text (Use <code>&#123;&#123;variable_name&#125;&#125;</code> for dynamic inputs):
          </label>
          <span style={{ fontSize: '0.75rem', color: vars.length > 0 ? '#34d399' : '#64748b' }}>
            {vars.length} dynamic placeholder{vars.length === 1 ? '' : 's'} detected
          </span>
        </div>

        <textarea
          rows={11}
          value={template.templateText}
          onChange={(e) => handleFieldChange('templateText', e.target.value)}
          style={{
            width: '100%',
            background: '#090d16',
            border: '1px solid #334155',
            borderRadius: 6,
            padding: '12px',
            color: '#f8fafc',
            fontSize: '0.86rem',
            fontFamily: 'monospace',
            lineHeight: 1.5,
            outline: 'none',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Telemetry Bar */}
      <div style={{
        background: '#090d16',
        border: '1px solid #1e293b',
        borderRadius: 6,
        padding: '10px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        fontSize: '0.78rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
          <Hash size={14} color="#38bdf8" />
          <span>Estimated Tokens:</span>
          <strong style={{ color: '#f8fafc' }}>~{promptTokens}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
          <Coins size={14} color="#f59e0b" />
          <span>Estimated Cost (Gemini Flash):</span>
          <strong style={{ color: '#f59e0b' }}>${estCost.toFixed(6)} USD</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
          <Code size={14} color="#10b981" />
          <span>Variables:</span>
          <span style={{ color: '#34d399', fontWeight: 600 }}>
            {vars.length > 0 ? vars.join(', ') : 'None'}
          </span>
        </div>
      </div>
    </div>
  );
}
