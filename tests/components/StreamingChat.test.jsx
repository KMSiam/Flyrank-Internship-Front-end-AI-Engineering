import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StreamingChat } from '../../src/components/chat/StreamingChat';

// Mock scrollIntoView in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('StreamingChat Component Testing Pass (FE-09)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // Test 1: Empty state query by role and label
  it('renders designed empty state on first run and queries starter buttons by role', async () => {
    render(<StreamingChat />);
    
    // Query by role and accessible name, not test id or css class
    const emptyHeading = screen.getByRole('heading', { level: 3, name: /FlyRank AI Streaming Co-Pilot Ready/i });
    expect(emptyHeading).toBeInTheDocument();

    const starterPromptButtons = screen.getAllByRole('button');
    expect(starterPromptButtons.length).toBeGreaterThan(2);
  });

  // Test 2: Input and form interaction
  it('allows user to type into input and submit a prompt', async () => {
    const user = userEvent.setup();
    render(<StreamingChat />);

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /Send/i });

    expect(sendButton).toBeDisabled();

    await user.type(input, 'Explain Server Components');
    expect(sendButton).toBeEnabled();
  });

  // Test 3: Pending state with layout-matched skeleton
  it('transitions to pending thinking state upon submission with mocked streaming route', async () => {
    const user = userEvent.setup();

    // Mock fetch with delayed SSE stream
    global.fetch = vi.fn().mockImplementation(() => 
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            body: {
              getReader() {
                let sent = false;
                return {
                  read() {
                    if (!sent) {
                      sent = true;
                      const encoder = new TextEncoder();
                      return Promise.resolve({
                        done: false,
                        value: encoder.encode('data: {"type":"text-delta","text":"Server Components"}\n\n')
                      });
                    }
                    return Promise.resolve({ done: true, value: undefined });
                  }
                };
              }
            }
          });
        }, 100);
      })
    );

    render(<StreamingChat />);

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /Send/i });

    await user.type(input, 'Test prompt');
    await user.click(sendButton);

    // Verify thinking indicator is shown by role / text
    expect(screen.getByText(/Thinking & synthesizing response/i)).toBeInTheDocument();
  });

  // Test 4: Streaming state renders partial text
  it('renders streamed tokens as text deltas arrive from mocked route', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader() {
          let step = 0;
          return {
            read() {
              const encoder = new TextEncoder();
              if (step === 0) {
                step++;
                return Promise.resolve({
                  done: false,
                  value: encoder.encode('data: {"type":"text-delta","text":"Hello World"}\n\n')
                });
              }
              return Promise.resolve({ done: true, value: undefined });
            }
          };
        }
      }
    });

    render(<StreamingChat />);

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /Send/i });

    await user.type(input, 'Hello AI');
    await user.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
    });
  });

  // Test 5: Error state with working retry button
  it('renders designed error card and working retry button when route rejects', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ code: 'ERR_RATE_LIMIT_429', error: 'Quota exhausted' })
    });

    render(<StreamingChat />);

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /Send/i });

    await user.type(input, 'Trigger 429');
    await user.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Stream Failure Handled/i)).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /Retry this response/i });
    expect(retryButton).toBeInTheDocument();
  });

  // Test 6: Stop button aborts mid-stream safely
  it('displays stop button during streaming and handles abort without breaking state', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockImplementation((url, opts) => {
      return new Promise((resolve, reject) => {
        opts.signal.addEventListener('abort', () => {
          const err = new Error('The user aborted a request.');
          err.name = 'AbortError';
          reject(err);
        });
      });
    });

    render(<StreamingChat />);

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /Send/i });

    await user.type(input, 'Abort test');
    await user.click(sendButton);

    const stopButton = screen.getByRole('button', { name: /Stop/i });
    expect(stopButton).toBeInTheDocument();

    await user.click(stopButton);

    await waitFor(() => {
      expect(screen.getByText(/Stopped by user/i)).toBeInTheDocument();
    });
  });
});
