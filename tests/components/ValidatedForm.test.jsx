import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsClient } from '../../src/components/settings/SettingsClient';

describe('Validated Form Component Testing Pass (FE-09)', () => {
  it('renders validated settings form and queries fields by role and label', () => {
    render(<SettingsClient />);

    expect(screen.getByLabelText(/AI Gateway API Key/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Default System Persona/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Configuration/i })).toBeInTheDocument();
  });

  it('rejects invalid short API keys with a validation error alert', async () => {
    const user = userEvent.setup();
    render(<SettingsClient />);

    const apiKeyInput = screen.getByLabelText(/AI Gateway API Key/i);
    const saveButton = screen.getByRole('button', { name: /Save Configuration/i });

    await user.clear(apiKeyInput);
    await user.type(apiKeyInput, 'sk-short');
    await user.click(saveButton);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/API key must start with 'sk-' or 'anthropic-'/i)).toBeInTheDocument();
  });
});
