import React from 'react';
import { Sparkles, Download, Upload, Plus, Layers } from 'lucide-react';

export function Header({ onNewTemplate, onExport, onImport }) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onImport) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          onImport(parsed);
        } catch (err) {
          alert('Invalid JSON file format: ' + err.message);
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  return (
    <header style={{
      background: '#0d111a',
      borderBottom: '1px solid #1e293b',
      padding: '14px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 12
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          background: 'linear-gradient(135deg, #0284c7, #2563eb)',
          padding: 8,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          <Sparkles size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              PromptCraft Studio AI
            </h1>
            <span style={{
              background: 'rgba(66, 133, 244, 0.15)',
              border: '1px solid #4285f4',
              color: '#60a5fa',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 9999,
              letterSpacing: '0.04em'
            }}>
              Google Antigravity · Gemini 3.8 Flash High
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
            Interactive Prompt Engineering Studio, Variable Interpolation &amp; Quality Evaluator
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={onNewTemplate}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#0284c7',
            color: '#ffffff',
            border: 'none',
            borderRadius: 6,
            padding: '7px 12px',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Plus size={15} />
          New Prompt
        </button>

        <button
          onClick={onExport}
          title="Export all templates to JSON"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#1e293b',
            color: '#cbd5e1',
            border: '1px solid #334155',
            borderRadius: 6,
            padding: '7px 12px',
            fontSize: '0.82rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <Download size={15} />
          Export JSON
        </button>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: '#1e293b',
          color: '#cbd5e1',
          border: '1px solid #334155',
          borderRadius: 6,
          padding: '7px 12px',
          fontSize: '0.82rem',
          fontWeight: 500,
          cursor: 'pointer'
        }}>
          <Upload size={15} />
          Import
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
      </div>
    </header>
  );
}
