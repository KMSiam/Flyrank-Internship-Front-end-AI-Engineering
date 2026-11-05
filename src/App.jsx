import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.jsx';
import { TemplateList } from './components/TemplateList.jsx';
import { PromptEditor } from './components/PromptEditor.jsx';
import { VariableInputs } from './components/VariableInputs.jsx';
import { Playground } from './components/Playground.jsx';
import { Scorecard } from './components/Scorecard.jsx';
import { DEFAULT_TEMPLATES } from './data/defaultTemplates.js';
import { extractVariables } from './utils/promptParser.js';

const STORAGE_KEY = 'promptcraft_studio_templates';

export default function App() {
  const [templates, setTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load templates from localStorage:', e);
    }
    return DEFAULT_TEMPLATES;
  });

  const [activeTemplateId, setActiveTemplateId] = useState(() => {
    return templates[0]?.id || 'tmpl-fullstack-arch';
  });

  // Track variable values per template ID
  const [variablesByTemplate, setVariablesByTemplate] = useState(() => {
    const initial = {};
    DEFAULT_TEMPLATES.forEach(t => {
      initial[t.id] = { ...t.defaultVariables };
    });
    return initial;
  });

  // Sync templates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    } catch (e) {
      console.warn('Failed to save templates to localStorage:', e);
    }
  }, [templates]);

  const activeTemplate = templates.find(t => t.id === activeTemplateId) || templates[0];
  const currentVariables = variablesByTemplate[activeTemplate?.id] || {};

  const handleSelectTemplate = (id) => {
    setActiveTemplateId(id);
  };

  const handleUpdateTemplate = (updated) => {
    setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleNewTemplate = () => {
    const newId = `tmpl-custom-${Date.now()}`;
    const newTemplate = {
      id: newId,
      title: 'New Custom Template',
      category: 'Coding',
      tags: ['Custom', 'Vite'],
      systemRole: 'You are an AI assistant designed to produce accurate, high-quality output.',
      templateText: 'You are an expert assistant.\n\nTask: Analyze the following input:\n{{input_data}}\n\nConstraints:\n- Do not include conversational filler\n- Provide step-by-step reasoning\n- Format the response in valid Markdown bullet points.',
      defaultVariables: {
        input_data: 'Sample payload data'
      }
    };

    setTemplates(prev => [newTemplate, ...prev]);
    setActiveTemplateId(newId);
    setVariablesByTemplate(prev => ({
      ...prev,
      [newId]: { input_data: 'Sample payload data' }
    }));
  };

  const handleDuplicateTemplate = (id) => {
    const target = templates.find(t => t.id === id);
    if (!target) return;

    const dupId = `${target.id}-copy-${Date.now().toString().slice(-4)}`;
    const duplicated = {
      ...target,
      id: dupId,
      title: `${target.title} (Copy)`,
    };

    setTemplates(prev => [...prev, duplicated]);
    setActiveTemplateId(dupId);
    setVariablesByTemplate(prev => ({
      ...prev,
      [dupId]: { ...(variablesByTemplate[target.id] || target.defaultVariables || {}) }
    }));
  };

  const handleDeleteTemplate = (id) => {
    if (templates.length <= 1) {
      alert('You must retain at least one template in the studio.');
      return;
    }
    const filtered = templates.filter(t => t.id !== id);
    setTemplates(filtered);
    if (activeTemplateId === id) {
      setActiveTemplateId(filtered[0].id);
    }
  };

  const handleVariableChange = (varName, value) => {
    if (!activeTemplate) return;
    setVariablesByTemplate(prev => ({
      ...prev,
      [activeTemplate.id]: {
        ...(prev[activeTemplate.id] || {}),
        [varName]: value
      }
    }));
  };

  const handleExport = () => {
    const payload = JSON.stringify(templates, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `promptcraft_studio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (imported) => {
    if (Array.isArray(imported) && imported.length > 0) {
      setTemplates(imported);
      setActiveTemplateId(imported[0].id);
      alert(`Successfully imported ${imported.length} prompt templates!`);
    } else {
      alert('Invalid template format. Expected an array of template objects.');
    }
  };

  const detectedVars = extractVariables(activeTemplate?.templateText || '');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      minHeight: 0,
      background: '#090d16',
      color: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {/* Top Header */}
      <Header
        onNewTemplate={handleNewTemplate}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* Main Studio Body: 3-Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px minmax(450px, 1.2fr) minmax(420px, 1fr)',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden'
      }}>
        {/* Left Column: Template Navigator */}
        <div style={{ overflowY: 'auto', borderRight: '1px solid #1e293b' }}>
          <TemplateList
            templates={templates}
            activeTemplateId={activeTemplateId}
            onSelectTemplate={handleSelectTemplate}
            onDuplicateTemplate={handleDuplicateTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        </div>

        {/* Center Column: Editor & Dynamic Variable Binding */}
        <div style={{
          overflowY: 'auto',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          borderRight: '1px solid #1e293b'
        }}>
          <PromptEditor
            template={activeTemplate}
            onChange={handleUpdateTemplate}
          />

          <VariableInputs
            template={activeTemplate}
            variables={currentVariables}
            onVariableChange={handleVariableChange}
          />
        </div>

        {/* Right Column: Playground Simulator & Quality Scorecard */}
        <div style={{
          overflowY: 'auto',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          background: '#0a0f1d'
        }}>
          <Scorecard
            templateText={activeTemplate?.templateText || ''}
            variables={detectedVars}
          />

          <Playground
            template={activeTemplate}
            variables={currentVariables}
          />
        </div>
      </div>

      {/* Studio Footer Telemetry Bar */}
      <footer style={{
        background: '#0b0f19',
        borderTop: '1px solid #1e293b',
        padding: '8px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.75rem',
        color: '#64748b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>Active Template: <strong style={{ color: '#94a3b8' }}>{activeTemplate?.title}</strong></span>
          <span>•</span>
          <span>Variables Detected: <strong style={{ color: '#38bdf8' }}>{detectedVars.length}</strong></span>
          <span>•</span>
          <span>Engine: <strong style={{ color: '#818cf8' }}>Google Antigravity (Gemini 3.8 Flash High)</strong></span>
        </div>
        <div>
          <span>FlyRank Frontend AI Engineering • Week 3 Foundations</span>
        </div>
      </footer>
    </div>
  );
}
