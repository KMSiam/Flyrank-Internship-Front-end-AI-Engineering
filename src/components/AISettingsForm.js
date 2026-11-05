import React, { useState } from 'react';

/**
 * Round 1: AISettingsForm (Generated via vague prompt: "build a settings form for my ai app")
 * Note: Produced with uncontrolled state soup, naive inline validation, and missing WCAG accessibility.
 */
export function AISettingsForm({ onSave }) {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [stream, setStream] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setSuccess(false);

    // Naive inline validation with edge-case bugs
    if (!apiKey) {
      setError('API key is required');
      return { success: false, error: 'API key is required' };
    }

    if (!systemPrompt) {
      setError('System prompt is required');
      return { success: false, error: 'System prompt is required' };
    }

    // AI Mistake Caught: Fails to check temperature bounds (accepts negative or > 1.0)
    // AI Mistake Caught: Whitespace-only string "   " passes !systemPrompt check
    // AI Mistake Caught: webhookUrl accepts non-URL strings like "foo"

    const payload = {
      apiKey,
      model,
      temperature: Number(temperature),
      maxTokens: Number(maxTokens),
      systemPrompt,
      stream,
      webhookUrl
    };

    if (onSave) {
      onSave(payload);
    }
    setSuccess(true);
    return { success: true, payload };
  };

  return React.createElement(
    'form',
    {
      onSubmit: handleSubmit,
      style: { maxWidth: 480, margin: '20px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }
    },
    React.createElement('h2', null, 'AI Settings'),
    error && React.createElement('div', { style: { color: 'red', marginBottom: 10 } }, error),
    success && React.createElement('div', { style: { color: 'green', marginBottom: 10 } }, 'Settings saved!'),

    // Accessibility issue: label has no htmlFor, input has no id
    React.createElement(
      'div',
      { style: { marginBottom: 12 } },
      React.createElement('label', null, 'API Key:'),
      React.createElement('input', {
        type: 'password',
        value: apiKey,
        onChange: (e) => setApiKey(e.target.value),
        placeholder: 'sk-...',
        style: { width: '100%', padding: 8, marginTop: 4 }
      })
    ),

    React.createElement(
      'div',
      { style: { marginBottom: 12 } },
      React.createElement('label', null, 'Model:'),
      React.createElement(
        'select',
        {
          value: model,
          onChange: (e) => setModel(e.target.value),
          style: { width: '100%', padding: 8, marginTop: 4 }
        },
        React.createElement('option', { value: 'gpt-4' }, 'GPT-4'),
        React.createElement('option', { value: 'gpt-3.5-turbo' }, 'GPT-3.5 Turbo'),
        React.createElement('option', { value: 'claude-3-sonnet' }, 'Claude 3 Sonnet')
      )
    ),

    React.createElement(
      'div',
      { style: { marginBottom: 12 } },
      React.createElement('label', null, `Temperature: ${temperature}`),
      React.createElement('input', {
        type: 'number',
        step: '0.1',
        value: temperature,
        onChange: (e) => setTemperature(e.target.value),
        style: { width: '100%', padding: 8, marginTop: 4 }
      })
    ),

    React.createElement(
      'div',
      { style: { marginBottom: 12 } },
      React.createElement('label', null, 'Max Tokens:'),
      React.createElement('input', {
        type: 'number',
        value: maxTokens,
        onChange: (e) => setMaxTokens(e.target.value),
        style: { width: '100%', padding: 8, marginTop: 4 }
      })
    ),

    React.createElement(
      'div',
      { style: { marginBottom: 12 } },
      React.createElement('label', null, 'System Prompt:'),
      React.createElement('textarea', {
        value: systemPrompt,
        onChange: (e) => setSystemPrompt(e.target.value),
        rows: 4,
        placeholder: 'You are a helpful assistant...',
        style: { width: '100%', padding: 8, marginTop: 4 }
      })
    ),

    React.createElement(
      'div',
      { style: { marginBottom: 12 } },
      React.createElement(
        'label',
        null,
        React.createElement('input', {
          type: 'checkbox',
          checked: stream,
          onChange: (e) => setStream(e.target.checked),
          style: { marginRight: 8 }
        }),
        'Enable Streaming Responses'
      )
    ),

    React.createElement(
      'div',
      { style: { marginBottom: 16 } },
      React.createElement('label', null, 'Webhook URL (optional):'),
      React.createElement('input', {
        type: 'text',
        value: webhookUrl,
        onChange: (e) => setWebhookUrl(e.target.value),
        placeholder: 'https://...',
        style: { width: '100%', padding: 8, marginTop: 4 }
      })
    ),

    React.createElement(
      'button',
      {
        type: 'submit',
        style: { width: '100%', padding: 10, background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }
      },
      'Save Settings'
    )
  );
}
