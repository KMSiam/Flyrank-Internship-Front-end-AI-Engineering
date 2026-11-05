import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PromptScoreCard } from '../../src/components/tools/PromptScoreCard';
import { ToolErrorCard } from '../../src/components/tools/ToolErrorCard';

describe('Tool Results Component Testing Pass (FE-09)', () => {
  const mockResult = {
    success: true,
    overallScore: 88,
    verdict: 'EXCELLENT',
    targetDomain: 'coding',
    dimensions: {
      clarity: 90,
      specificity: 85,
      guardrails: 89,
    },
    recommendations: [
      'Include explicit negative constraints',
      'Specify response token limit'
    ],
    telemetry: {
      latencyMs: 38,
      tokenCount: 52,
      toolName: 'scorePromptEngineering'
    }
  };

  it('renders overall score and verdict badge querying by role and text', () => {
    render(<PromptScoreCard result={mockResult} />);

    // Verdict and composite score
    expect(screen.getByText(/EXCELLENT/i)).toBeInTheDocument();
    expect(screen.getByText(/88\/100/i)).toBeInTheDocument();
  });

  it('renders dimensional breakdown and recommendations list items', () => {
    render(<PromptScoreCard result={mockResult} />);

    expect(screen.getAllByText(/Clarity/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Specificity/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Guardrails/i).length).toBeGreaterThan(0);

    expect(screen.getByText(/Include explicit negative constraints/i)).toBeInTheDocument();
  });

  it('renders ToolErrorCard with error taxonomy and retry button by role', () => {
    const mockError = {
      code: 'ERR_INSUFFICIENT_CONTEXT',
      message: 'Prompt must be at least 5 characters long.',
      remediation: 'Expand template context.'
    };

    render(<ToolErrorCard error={mockError} onRetry={() => {}} />);

    expect(screen.getByText('ERR_INSUFFICIENT_CONTEXT')).toBeInTheDocument();
    expect(screen.getByText(/Prompt must be at least 5 characters long/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /Retry Tool Execution/i });
    expect(retryBtn).toBeInTheDocument();
  });
});
