import React, { useState } from 'react';
import { Search, Copy, Trash2, Tag, Layers } from 'lucide-react';
import { extractVariables } from '../utils/promptParser.js';

export function TemplateList({
  templates,
  activeTemplateId,
  onSelectTemplate,
  onDuplicateTemplate,
  onDeleteTemplate
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Coding', 'Compliance', 'Analysis', 'System'];

  const filteredTemplates = templates.filter((tmpl) => {
    const matchesCategory = selectedCategory === 'All' || tmpl.category === selectedCategory;
    const matchesSearch =
      tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tmpl.tags && tmpl.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#0d111a',
      borderRight: '1px solid #1e293b'
    }}>
      {/* Search Input */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e293b' }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={16} style={{ position: 'absolute', left: 10, color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search templates or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#161e2e',
              border: '1px solid #27354a',
              borderRadius: 6,
              padding: '7px 10px 7px 32px',
              color: '#f8fafc',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? '#0284c7' : '#161e2e',
                color: selectedCategory === cat ? '#ffffff' : '#94a3b8',
                border: selectedCategory === cat ? '1px solid #0284c7' : '1px solid #27354a',
                borderRadius: 4,
                padding: '3px 8px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
        {filteredTemplates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b', fontSize: '0.82rem' }}>
            No prompt templates found matching search criteria.
          </div>
        ) : (
          filteredTemplates.map((tmpl) => {
            const isActive = tmpl.id === activeTemplateId;
            const vars = extractVariables(tmpl.templateText);

            return (
              <div
                key={tmpl.id}
                onClick={() => onSelectTemplate(tmpl.id)}
                style={{
                  background: isActive ? 'rgba(2, 132, 199, 0.12)' : '#111827',
                  border: isActive ? '1px solid #0284c7' : '1px solid #1f2937',
                  borderRadius: 8,
                  padding: '12px 14px',
                  marginBottom: 10,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: isActive ? '#38bdf8' : '#f1f5f9' }}>
                    {tmpl.title}
                  </h3>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateTemplate(tmpl.id);
                      }}
                      title="Duplicate Template"
                      style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 2 }}
                    >
                      <Copy size={13} />
                    </button>
                    {templates.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${tmpl.title}"?`)) {
                            onDeleteTemplate(tmpl.id);
                          }
                        }}
                        title="Delete Template"
                        style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 2 }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    background: '#1e293b',
                    color: '#94a3b8',
                    padding: '2px 6px',
                    borderRadius: 4
                  }}>
                    {tmpl.category}
                  </span>

                  <span style={{
                    fontSize: '0.68rem',
                    background: vars.length > 0 ? 'rgba(16, 185, 129, 0.15)' : '#1e293b',
                    color: vars.length > 0 ? '#34d399' : '#64748b',
                    padding: '2px 6px',
                    borderRadius: 4
                  }}>
                    {vars.length} {vars.length === 1 ? 'variable' : 'variables'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
