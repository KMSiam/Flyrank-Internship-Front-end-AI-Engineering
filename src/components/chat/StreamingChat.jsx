'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Square,
  Bot,
  User,
  Sparkles,
  ArrowDown,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Clock,
  Coins
} from 'lucide-react';
import { MODEL_CONFIG } from '../../lib/aiConfig.js';

const STORAGE_KEY = 'flyrank_streaming_chat_history_v1';

const INITIAL_MESSAGES = [
  {
    id: 'seed-1',
    role: 'assistant',
    content: "Welcome to the FlyRank Streaming AI Chat Interface. I am your engineering co-pilot. Responses stream token-by-token with backpressure control. How can I assist with your frontend architecture today?",
    timestamp: '12:00 PM',
    tokens: 36
  }
];

export function StreamingChat() {
  const [messages, setMessages] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Failed to load chat history:', e);
      }
    }
    return INITIAL_MESSAGES;
  });

  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'thinking' | 'streaming' | 'stopped'
  const [selectedModel, setSelectedModel] = useState(MODEL_CONFIG.defaultModel);
  const [autoScrollPinned, setAutoScrollPinned] = useState(true);
  const [showScrollBottomButton, setShowScrollBottomButton] = useState(false);

  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Sync messages to localStorage for persistence across reloads
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat history:', e);
    }
  }, [messages]);

  // Robust Auto-Scroll: Pin to bottom only if user hasn't scrolled up
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
    setAutoScrollPinned(true);
    setShowScrollBottomButton(false);
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // User is considered at bottom if within 80px threshold
    const atBottom = scrollHeight - scrollTop - clientHeight < 80;
    setAutoScrollPinned(atBottom);
    setShowScrollBottomButton(!atBottom);
  };

  useEffect(() => {
    if (autoScrollPinned) {
      scrollToBottom('auto');
    }
  }, [messages, status, autoScrollPinned, scrollToBottom]);

  // Handle Send with Token-by-Token Streaming
  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || status === 'thinking' || status === 'streaming') return;

    const userText = input.trim();
    setInput('');

    const userMsg = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tokens: Math.ceil(userText.split(' ').length * 1.33)
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // Initial state: 'thinking' indicator
    setStatus('thinking');
    setAutoScrollPinned(true);

    const botMessageId = `bot-${Date.now()}`;
    const botMsg = {
      id: botMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tokens: 0
    };

    setMessages([...updatedMessages, botMsg]);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          model: selectedModel
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to stream message`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let receivedFirstToken = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const dataStr = line.slice(6).trim();

          if (dataStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.type === 'text-delta' && parsed.text) {
              if (!receivedFirstToken) {
                // Smooth handoff from thinking to streaming
                receivedFirstToken = true;
                setStatus('streaming');
              }

              setMessages(prev => prev.map(m => {
                if (m.id === botMessageId) {
                  const newContent = m.content + parsed.text;
                  return {
                    ...m,
                    content: newContent,
                    tokens: Math.ceil(newContent.split(' ').length * 1.33)
                  };
                }
                return m;
              }));
            }
          } catch (err) {
            // Non-JSON or partial line
          }
        }
      }

      setStatus('idle');
    } catch (err) {
      if (err.name === 'AbortError') {
        setStatus('stopped');
        console.log('Stream successfully aborted by user. Partial message retained.');
      } else {
        setStatus('idle');
        setMessages(prev => prev.map(m => {
          if (m.id === botMessageId && !m.content) {
            return {
              ...m,
              content: 'Stream disconnected or encountered a network error. You can try sending again.',
            };
          }
          return m;
        }));
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  // Stop button handler: Preserves partial message, re-enables input
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear conversational history?')) {
      setMessages(INITIAL_MESSAGES);
      localStorage.removeItem(STORAGE_KEY);
      setStatus('idle');
    }
  };

  return (
    <div className="relative flex flex-col h-[740px] rounded-2xl border border-border bg-[#0f172a] shadow-2xl overflow-hidden">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-[#090d16] p-3.5 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-950/80 border border-sky-500/30 text-sky-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white">Streaming AI Chat Studio</h2>
            <div className="text-[10px] text-slate-400 font-mono">FE-06 Token Streaming & Backpressure</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Model Selector */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={status === 'streaming' || status === 'thinking'}
            className="rounded-lg border border-border bg-[#111827] px-2.5 py-1 text-xs text-sky-400 font-mono outline-none focus:border-primary disabled:opacity-50"
            aria-label="Select AI Model"
          >
            {MODEL_CONFIG.supportedModels.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          {/* Clear History */}
          <button
            type="button"
            onClick={handleClearHistory}
            className="rounded-lg border border-border p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Clear Chat History"
            aria-label="Clear chat history"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
      >
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const isLast = index === messages.length - 1;
          const showThinking = isLast && !isUser && status === 'thinking' && !msg.content;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                isUser
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-400'
              }`}>
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                isUser
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-[#162036] text-slate-200 border border-border rounded-tl-none'
              }`}>
                {/* Thinking Shimmer Indicator */}
                {showThinking && (
                  <div className="flex items-center gap-2 text-sky-400 py-1">
                    <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
                    <span className="font-mono text-xs font-semibold animate-pulse">Thinking & synthesizing response...</span>
                  </div>
                )}

                {/* Rendered Text */}
                {msg.content && (
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                    {status === 'streaming' && isLast && !isUser && (
                      <span className="inline-block h-3.5 w-1.5 bg-sky-400 animate-pulse ml-1 translate-y-0.5" />
                    )}
                  </div>
                )}

                {/* Metadata & Status */}
                <div className={`mt-2 flex items-center gap-2 text-[10px] ${isUser ? 'text-sky-200' : 'text-slate-500 font-mono'}`}>
                  <span>{msg.timestamp}</span>
                  <span>•</span>
                  <span>{msg.tokens || 0} tokens</span>
                  {isLast && !isUser && status === 'stopped' && (
                    <span className="text-amber-400 font-semibold">• Stopped by user</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating "Scroll to Latest" Button */}
      {showScrollBottomButton && (
        <button
          type="button"
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-20 right-6 z-20 flex items-center gap-1.5 rounded-full bg-slate-800/95 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-sky-400 shadow-xl backdrop-blur hover:bg-slate-700 transition-all"
        >
          <ArrowDown className="h-3.5 w-3.5" />
          <span>Scroll to latest</span>
        </button>
      )}

      {/* Input Composer & Controls */}
      <div className="border-t border-border bg-[#090d16] p-3 sm:p-4">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              status === 'streaming'
                ? 'Streaming tokens in progress...'
                : status === 'thinking'
                ? 'Waiting for first token...'
                : 'Ask anything to test multi-turn streaming token completion...'
            }
            disabled={status === 'streaming' || status === 'thinking'}
            className="flex-1 rounded-xl border border-border bg-[#111827] px-4 py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-primary disabled:opacity-60 transition-colors"
          />

          {status === 'streaming' || status === 'thinking' ? (
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all shrink-0"
              title="Stop Generation"
            >
              <Square className="h-4 w-4 fill-white" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all disabled:opacity-40 shrink-0"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          )}
        </form>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Server Route: /api/chat</span>
          </span>
          <span>Zero Client Secrets · Multi-Turn History Saved</span>
        </div>
      </div>
    </div>
  );
}
