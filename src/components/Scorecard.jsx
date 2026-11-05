import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, ShieldCheck, Zap, Crosshair } from 'lucide-react';
import { evaluatePromptQuality } from '../utils/evaluator.js';

export function Scorecard({ templateText = '', variables = [] }) {
  const evaluation = evaluatePromptQuality(templateText, variables);
  const { overallScore, qualityTier, clarityScore, specificityScore, constraintScore, suggestions } = evaluation;

  const getTierColors = (tier) => {
    switch (tier) {
      case 'EXCELLENT':
        return { bg: '#064e3b', text: '#34d399', border: '#059669', badgeBg: 'rgba(5, 150, 105, 0.2)' };
      case 'GOOD':
        return { bg: '#0c4a6e', text: '#38bdf8', border: '#0284c7', badgeBg: 'rgba(2, 132, 199, 0.2)' };
      case 'MODERATE':
        return { bg: '#78350f', text: '#fbbf24', border: '#d97706', badgeBg: 'rgba(217, 119, 6, 0.2)' };
      default:
        return { bg: '#881337', text: '#fb7185', border: '#e11d48', badgeBg: 'rgba(225, 29, 72, 0.2)' };
    }
  };

  const colors = getTierColors(qualityTier);

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
      {/* Scorecard Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 12,
        borderBottom: '1px solid #1e293b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} color="#818cf8" />
          <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            AI Quality Scorecard
          </h3>
        </div>
        <span style={{
          padding: '4px 10px',
          fontSize: '0.75rem',
          fontWeight: 700,
          borderRadius: 9999,
          background: colors.badgeBg,
          color: colors.text,
          border: `1px solid ${colors.border}`
        }}>
          {qualityTier} ({overallScore}/100)
        </span>
      </div>

      {/* Main Score Display Progress Bars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        {/* Clarity */}
        <div style={{ background: '#090d16', padding: '10px 12px', borderRadius: 8, border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: 6 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Zap size={13} color="#60a5fa" /> Clarity
            </span>
            <span style={{ fontFamily: 'monospace', color: '#f8fafc', fontWeight: 600 }}>{clarityScore}%</span>
          </div>
          <div style={{ width: '100%', background: '#1e293b', height: 6, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ background: '#3b82f6', height: '100%', width: `${clarityScore}%`, transition: 'width 0.3s' }}></div>
          </div>
        </div>

        {/* Specificity */}
        <div style={{ background: '#090d16', padding: '10px 12px', borderRadius: 8, border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: 6 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Crosshair size={13} color="#c084fc" /> Specificity
            </span>
            <span style={{ fontFamily: 'monospace', color: '#f8fafc', fontWeight: 600 }}>{specificityScore}%</span>
          </div>
          <div style={{ width: '100%', background: '#1e293b', height: 6, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ background: '#a855f7', height: '100%', width: `${specificityScore}%`, transition: 'width 0.3s' }}></div>
          </div>
        </div>

        {/* Guardrails */}
        <div style={{ background: '#090d16', padding: '10px 12px', borderRadius: 8, border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: 6 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <ShieldCheck size={13} color="#34d399" /> Guardrails
            </span>
            <span style={{ fontFamily: 'monospace', color: '#f8fafc', fontWeight: 600 }}>{constraintScore}%</span>
          </div>
          <div style={{ width: '100%', background: '#1e293b', height: 6, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ background: '#10b981', height: '100%', width: `${constraintScore}%`, transition: 'width 0.3s' }}></div>
          </div>
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
          Optimization Recommendations
        </div>
        {suggestions.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: 10,
            background: 'rgba(5, 150, 105, 0.1)',
            border: '1px solid rgba(5, 150, 105, 0.3)',
            borderRadius: 6,
            color: '#34d399',
            fontSize: '0.8rem'
          }}>
            <CheckCircle2 size={16} color="#34d399" />
            <span>Optimal prompt structure detected! Action verbs, persona, and constraints verified.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {suggestions.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                padding: '8px 10px',
                background: '#090d16',
                border: '1px solid #1e293b',
                borderRadius: 6,
                color: '#cbd5e1',
                fontSize: '0.78rem',
                lineHeight: 1.4
              }}>
                <AlertCircle size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Scorecard;
