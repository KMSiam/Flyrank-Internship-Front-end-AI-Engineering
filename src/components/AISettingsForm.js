import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { aiSettingsSchema, DEFAULT_AI_SETTINGS } from '../schemas/aiSettingsSchema.js';

/**
 * Round 2: Production-grade AISettingsForm
 * Generated via precise prompt with strict Zod schema validation,
 * react-hook-form integration, and WCAG 2.1 AA accessibility.
 */
export function AISettingsForm({ defaultValues = DEFAULT_AI_SETTINGS, onSave }) {
  const [saveStatus, setSaveStatus] = useState(null); // 'saving' | 'saved' | null

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(aiSettingsSchema),
    defaultValues,
    mode: 'onBlur'
  });

  const currentSystemPrompt = watch('systemPrompt', defaultValues.systemPrompt || '');
  const promptCharCount = (currentSystemPrompt || '').length;

  const onSubmit = async (data) => {
    setSaveStatus('saving');
    try {
      if (onSave) {
        await onSave(data);
      }
      setSaveStatus('saved');
    } catch (err) {
      setSaveStatus('error');
    }
  };

  return React.createElement(
    'form',
    {
      onSubmit: handleSubmit(onSubmit),
      noValidate: true,
      'aria-labelledby': 'form-title',
      style: {
        maxWidth: 520,
        margin: '24px auto',
        padding: 24,
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }
    },
    // Form Header
    React.createElement(
      'div',
      { style: { borderBottom: '1px solid #f1f5f9', paddingBottom: 12, marginBottom: 18 } },
      React.createElement('h2', { id: 'form-title', style: { margin: 0, fontSize: '1.25rem', color: '#0f172a' } }, 'AI Model Preferences & Provider Settings'),
      React.createElement('p', { style: { margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' } }, 'Configure model selection, sampling temperature, and security webhook boundaries.')
    ),

    // Status Banner
    saveStatus === 'saved' &&
      React.createElement(
        'div',
        {
          role: 'status',
          'aria-live': 'polite',
          style: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: '0.85rem' }
        },
        '✔ Configuration saved successfully and verified against schema.'
      ),

    // Field 1: API Key
    React.createElement(
      'div',
      { style: { marginBottom: 16 } },
      React.createElement('label', { htmlFor: 'apiKey', style: { display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: 4, color: '#334155' } }, 'Provider API Key:'),
      React.createElement('input', {
        id: 'apiKey',
        type: 'password',
        ...register('apiKey'),
        'aria-invalid': Boolean(errors.apiKey),
        'aria-describedby': errors.apiKey ? 'apiKey-error' : 'apiKey-hint',
        placeholder: 'sk-ant-api03-... or sk-...',
        style: {
          width: '100%',
          padding: '8px 12px',
          border: errors.apiKey ? '1px solid #ef4444' : '1px solid #cbd5e1',
          borderRadius: 6,
          fontSize: '0.9rem',
          boxSizing: 'border-box'
        }
      }),
      !errors.apiKey &&
        React.createElement('span', { id: 'apiKey-hint', style: { display: 'block', fontSize: '0.75rem', color: '#64748b', marginTop: 4 } }, "Keys must start with 'sk-' or 'anthropic-' followed by at least 16 characters."),
      errors.apiKey &&
        React.createElement('span', { id: 'apiKey-error', role: 'alert', style: { display: 'block', fontSize: '0.75rem', color: '#ef4444', marginTop: 4, fontWeight: 500 } }, errors.apiKey.message)
    ),

    // Field 2: Model Selection
    React.createElement(
      'div',
      { style: { marginBottom: 16 } },
      React.createElement('label', { htmlFor: 'model', style: { display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: 4, color: '#334155' } }, 'Active Model:'),
      React.createElement(
        'select',
        {
          id: 'model',
          ...register('model'),
          'aria-invalid': Boolean(errors.model),
          'aria-describedby': errors.model ? 'model-error' : undefined,
          style: { width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.9rem', boxSizing: 'border-box' }
        },
        React.createElement('option', { value: 'claude-3-7-sonnet' }, 'Anthropic Claude 3.7 Sonnet (Recommended)'),
        React.createElement('option', { value: 'claude-3-5-haiku' }, 'Anthropic Claude 3.5 Haiku (Fast)'),
        React.createElement('option', { value: 'gpt-4o' }, 'OpenAI GPT-4o'),
        React.createElement('option', { value: 'gemini-1.5-pro' }, 'Google Gemini 1.5 Pro')
      ),
      errors.model &&
        React.createElement('span', { id: 'model-error', role: 'alert', style: { display: 'block', fontSize: '0.75rem', color: '#ef4444', marginTop: 4 } }, errors.model.message)
    ),

    // Field 3 & 4: Temperature & Max Tokens Grid
    React.createElement(
      'div',
      { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 } },
      // Temperature
      React.createElement(
        'div',
        null,
        React.createElement('label', { htmlFor: 'temperature', style: { display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: 4, color: '#334155' } }, 'Temperature (0.0 - 1.0):'),
        React.createElement('input', {
          id: 'temperature',
          type: 'number',
          step: '0.05',
          ...register('temperature'),
          'aria-invalid': Boolean(errors.temperature),
          'aria-describedby': errors.temperature ? 'temperature-error' : undefined,
          style: { width: '100%', padding: '8px 12px', border: errors.temperature ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.9rem', boxSizing: 'border-box' }
        }),
        errors.temperature &&
          React.createElement('span', { id: 'temperature-error', role: 'alert', style: { display: 'block', fontSize: '0.75rem', color: '#ef4444', marginTop: 4 } }, errors.temperature.message)
      ),
      // Max Tokens
      React.createElement(
        'div',
        null,
        React.createElement('label', { htmlFor: 'maxTokens', style: { display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: 4, color: '#334155' } }, 'Max Tokens (256 - 8192):'),
        React.createElement('input', {
          id: 'maxTokens',
          type: 'number',
          step: '128',
          ...register('maxTokens'),
          'aria-invalid': Boolean(errors.maxTokens),
          'aria-describedby': errors.maxTokens ? 'maxTokens-error' : undefined,
          style: { width: '100%', padding: '8px 12px', border: errors.maxTokens ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.9rem', boxSizing: 'border-box' }
        }),
        errors.maxTokens &&
          React.createElement('span', { id: 'maxTokens-error', role: 'alert', style: { display: 'block', fontSize: '0.75rem', color: '#ef4444', marginTop: 4 } }, errors.maxTokens.message)
      )
    ),

    // Field 5: System Prompt
    React.createElement(
      'div',
      { style: { marginBottom: 16 } },
      React.createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 } },
        React.createElement('label', { htmlFor: 'systemPrompt', style: { fontWeight: 600, fontSize: '0.85rem', color: '#334155' } }, 'System Instructions / Persona:'),
        React.createElement('span', { style: { fontSize: '0.75rem', color: promptCharCount > 2000 ? '#ef4444' : '#64748b' } }, `${promptCharCount} / 2000 chars`)
      ),
      React.createElement('textarea', {
        id: 'systemPrompt',
        rows: 4,
        ...register('systemPrompt'),
        'aria-invalid': Boolean(errors.systemPrompt),
        'aria-describedby': errors.systemPrompt ? 'systemPrompt-error' : undefined,
        style: {
          width: '100%',
          padding: '8px 12px',
          border: errors.systemPrompt ? '1px solid #ef4444' : '1px solid #cbd5e1',
          borderRadius: 6,
          fontSize: '0.85rem',
          fontFamily: 'monospace',
          boxSizing: 'border-box'
        }
      }),
      errors.systemPrompt &&
        React.createElement('span', { id: 'systemPrompt-error', role: 'alert', style: { display: 'block', fontSize: '0.75rem', color: '#ef4444', marginTop: 4 } }, errors.systemPrompt.message)
    ),

    // Field 6: Streaming Toggle
    React.createElement(
      'div',
      { style: { marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 } },
      React.createElement('input', {
        id: 'streamResponse',
        type: 'checkbox',
        ...register('streamResponse'),
        style: { width: 16, height: 16 }
      }),
      React.createElement('label', { htmlFor: 'streamResponse', style: { fontSize: '0.85rem', color: '#334155', fontWeight: 500 } }, 'Stream partial tokens in real-time (recommended for chat UX)')
    ),

    // Field 7: Webhook URL
    React.createElement(
      'div',
      { style: { marginBottom: 20 } },
      React.createElement('label', { htmlFor: 'webhookUrl', style: { display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: 4, color: '#334155' } }, 'Telemetry Webhook URL (Optional):'),
      React.createElement('input', {
        id: 'webhookUrl',
        type: 'url',
        ...register('webhookUrl'),
        'aria-invalid': Boolean(errors.webhookUrl),
        'aria-describedby': errors.webhookUrl ? 'webhookUrl-error' : 'webhookUrl-hint',
        placeholder: 'https://telemetry.yourdomain.com/events',
        style: { width: '100%', padding: '8px 12px', border: errors.webhookUrl ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.9rem', boxSizing: 'border-box' }
      }),
      !errors.webhookUrl &&
        React.createElement('span', { id: 'webhookUrl-hint', style: { display: 'block', fontSize: '0.75rem', color: '#64748b', marginTop: 4 } }, 'Must use secure HTTPS protocol.'),
      errors.webhookUrl &&
        React.createElement('span', { id: 'webhookUrl-error', role: 'alert', style: { display: 'block', fontSize: '0.75rem', color: '#ef4444', marginTop: 4 } }, errors.webhookUrl.message)
    ),

    // Submit Button
    React.createElement(
      'button',
      {
        type: 'submit',
        disabled: isSubmitting,
        style: {
          width: '100%',
          padding: '10px 16px',
          background: isSubmitting ? '#94a3b8' : '#0284c7',
          color: '#ffffff',
          fontWeight: 600,
          border: 'none',
          borderRadius: 6,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          fontSize: '0.95rem'
        }
      },
      isSubmitting ? 'Validating & Saving...' : 'Save AI Configuration'
    )
  );
}
