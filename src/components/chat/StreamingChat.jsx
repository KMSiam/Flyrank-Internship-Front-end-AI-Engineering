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
  AlertTriangle,
  RefreshCw,
  Flame,
  ShieldAlert,
  Zap,
  ArrowRight,
  WifiOff,
  Clock
} from 'lucide-react';
import { MODEL_CONFIG } from '../../lib/aiConfig.js';

const STORAGE_KEY = 'flyrank_streaming_chat_history_v1';

const STARTER_PROMPTS = [
  {
    title: 'Component Architecture',
    badge: 'Core Spec',
    prompt: 'How do Server Components and Client Components interact across streaming boundaries in Next.js 15?',
    icon: Zap,
    color: 'text-sky-400 bg-sky-950/40 border-sky-500/30'
  },
  {
    title: 'FinOps & Token Budget',
    badge: 'FinOps',
    prompt: 'Calculate token budget, cache hit ratios, and latency expectations for 1,000 daily active users.',
    icon: Sparkles,
    color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
  },
  {
    title: 'Sabotage: Mid-Stream Error',
    badge: 'Sabotage Drill',
    prompt: 'TRIGGER_MIDSTREAM_ERROR: Test mid-stream connection severance and partial token preservation.',
    icon: Flame,
    color: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
    isSabotage: true
  },
  {
    title: 'Sabotage: 429 Rate Limit',
    badge: 'Sabotage Drill',
    prompt: 'TRIGGER_RATE_LIMIT_429: Test upstream model quota backoff and designed retry recovery.',
    icon: ShieldAlert,
    color: 'text-rose-400 bg-rose-950/40 border-rose-500/30',
    isSabotage: true
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
    return []; // Start empty or load persisted to showcase Designed Empty State
  });

  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'thinking' | 'streaming' | 'stopped' | 'error'
  const [selectedModel, setSelectedModel] = useState(MODEL_CONFIG.defaultModel);
  const [sabotageMode, setSabotageMode] = useState('none'); // 'none' | 'midstream' | 'ratelimit' | 'network' | 'slow'
  const [retryingMessageId, setRetryingMessageId] = useState(null);
  const [autoScrollPinned, setAutoScrollPinned] = useState(true);
  const [showScrollBottomButton, setShowScrollBottomButton] = useState(false);

  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Sync messages to localStorage
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

  // Execute Stream for a given user prompt
  const executeStream = async (userText, targetBotId = null, overrideSabotage = null) => {
    const isRetry = Boolean(targetBotId);
    let botMessageId = targetBotId;
    let workingMessages = messages;

    if (!isRetry) {
      const userMsg = {
        id: `usr-${Date.now()}`,
        role: 'user',
        content: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tokens: Math.ceil(userText.split(' ').length * 1.33)
      };

      botMessageId = `bot-${Date.now()}`;
      const botMsg = {
        id: botMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tokens: 0,
        error: null,
        failedPrompt: userText
      };

      workingMessages = [...messages, userMsg, botMsg];
      setMessages(workingMessages);
    } else {
      // Clear error state on retrying message
      setMessages(prev => prev.map(m => {
        if (m.id === botMessageId) {
          return { ...m, error: null, content: '', tokens: 0 };
        }
        return m;
      }));
    }

    setStatus('thinking');
    setAutoScrollPinned(true);
    abortControllerRef.current = new AbortController();

    const activeSabotage = overrideSabotage !== null ? overrideSabotage : (sabotageMode === 'none' ? null : sabotageMode);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeSabotage ? { 'x-sabotage-scenario': activeSabotage } : {})
        },
        body: JSON.stringify({
          messages: workingMessages.filter(m => m.id !== botMessageId),
          model: selectedModel,
          sabotage: activeSabotage
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        let errData;
        try {
          errData = await response.json();
        } catch {
          errData = { error: `HTTP ${response.status} Network Failure` };
        }
        throw {
          status: response.status,
          code: errData.code || `ERR_HTTP_${response.status}`,
          message: errData.error || `HTTP ${response.status}: Stream initialization failed.`,
          retryAfter: errData.retryAfter
        };
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

            // Handle Mid-Stream Error Event from server
            if (parsed.type === 'error') {
              throw {
                code: parsed.code || 'ERR_MIDSTREAM_DROP',
                message: parsed.message || 'Stream connection severed mid-flight.',
                failedAtToken: parsed.failedAtToken
              };
            }

            if (parsed.type === 'text-delta' && parsed.text) {
              if (!receivedFirstToken) {
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
            if (err.code) throw err; // Re-throw structured error
          }
        }
      }

      setStatus('idle');
    } catch (err) {
      if (err.name === 'AbortError') {
        setStatus('stopped');
        console.log('Stream successfully aborted by user. Partial message retained.');
      } else {
        // Handled failure state: preserves partial tokens and attaches structured error
        setStatus('error');
        setMessages(prev => prev.map(m => {
          if (m.id === botMessageId) {
            return {
              ...m,
              error: {
                code: err.code || 'ERR_STREAM_FAILED',
                message: err.message || 'The streaming connection was interrupted.',
                status: err.status,
                failedPrompt: userText,
                failedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            };
          }
          return m;
        }));
      }
    } finally {
      abortControllerRef.current = null;
      setRetryingMessageId(null);
    }
  };

  // Submit Handler for Composer Form
  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || status === 'thinking' || status === 'streaming') return;

    setInput('');
    await executeStream(trimmed);
  };

  // Buttons with a Brain: Micro-interaction Retry Handler with Debounce
  const handleRetry = async (botMessageId, failedPrompt) => {
    if (retryingMessageId || status === 'thinking' || status === 'streaming') return;
    setRetryingMessageId(botMessageId);
    // Explicitly retry in normal happy-path mode to guarantee deterministic recovery
    await executeStream(failedPrompt, botMessageId, 'none');
  };

  // Stop Generation Handler
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Clear History Handler
  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setStatus('idle');
  };

  return (
    <div className="relative flex flex-col h-[740px] max-h-[85dvh] rounded-2xl border border-border bg-[#0f172a] shadow-2xl overflow-hidden overscroll-contain">
      {/* Top Header Controls & Sabotage Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-[#090d16] p-3 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-950/80 border border-sky-500/30 text-sky-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-white">Streaming AI Chat Studio</h2>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
                FE-08 Resilient
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Token Streaming · Error Boundaries · Sabotage Drill</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sabotage Drill Selector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-950/20 px-2 py-1 text-[11px] font-mono text-amber-300">
            <Flame className="h-3 w-3 text-amber-400 animate-pulse" />
            <span className="hidden md:inline text-[10px] uppercase font-bold text-amber-400/80">Drill:</span>
            <select
              value={sabotageMode}
              onChange={(e) => setSabotageMode(e.target.value)}
              disabled={status === 'streaming' || status === 'thinking'}
              className="bg-transparent text-[11px] text-amber-200 outline-none cursor-pointer font-sans"
              aria-label="Sabotage Scenario Drill"
            >
              <option value="none" className="bg-[#0f172a] text-slate-200">Normal (Happy Path)</option>
              <option value="midstream" className="bg-[#0f172a] text-amber-300">Sabotage: Mid-Stream Drop</option>
              <option value="ratelimit" className="bg-[#0f172a] text-rose-300">Sabotage: 429 Rate Limit</option>
              <option value="network" className="bg-[#0f172a] text-red-300">Sabotage: 503 Provider Outage</option>
              <option value="slow" className="bg-[#0f172a] text-blue-300">Sabotage: Slow Delay (Test CLS)</option>
            </select>
          </div>

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

          {/* Reset / Clear */}
          <button
            type="button"
            onClick={handleClearHistory}
            className="rounded-lg border border-border p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Reset to Empty State"
            aria-label="Clear chat history"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 touch-pan-y"
      >
        {/* DESIGNED EMPTY STATE (Onboarding with click-to-fill action cards) */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center py-8 text-center max-w-xl mx-auto">
            <div className="h-12 w-12 rounded-2xl bg-sky-950/80 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-3 shadow-lg shadow-sky-500/10">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
              FlyRank AI Streaming Co-Pilot Ready
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
              Designed empty state onboarding. Select any prompt card below to test happy-path streaming, or trigger deterministic sabotage failure drills to verify error recovery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
              {STARTER_PROMPTS.map((card, idx) => {
                const IconComponent = card.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (card.isSabotage) {
                        if (card.prompt.includes('MIDSTREAM')) setSabotageMode('midstream');
                        if (card.prompt.includes('429')) setSabotageMode('ratelimit');
                      } else {
                        setSabotageMode('none');
                      }
                      executeStream(card.prompt);
                    }}
                    className="p-3.5 rounded-xl border border-border bg-[#131b2e] hover:border-sky-500/40 hover:bg-[#18233c] transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`p-1 rounded-md border ${card.color}`}>
                          <IconComponent className="h-3 w-3" />
                        </div>
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 transition-colors">
                          {card.title}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {card.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {card.prompt}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MESSAGES LIST */}
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const isLast = index === messages.length - 1;
          const showThinking = isLast && !isUser && status === 'thinking' && !msg.content && !msg.error;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                isUser
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : msg.error
                  ? 'bg-amber-950/80 border border-amber-500/40 text-amber-400'
                  : 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-400'
              }`}>
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed transition-all ${
                isUser
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-[#162036] text-slate-200 border border-border rounded-tl-none'
              }`}>
                {/* LAYOUT-ACCURATE SKELETON (Prevents Cumulative Layout Shift - CLS) */}
                {showThinking && (
                  <div className="space-y-2.5 py-1">
                    <div className="flex items-center gap-2 text-sky-400 mb-2">
                      <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
                      <span className="font-mono text-xs font-semibold animate-pulse">
                        Thinking & synthesizing response...
                      </span>
                    </div>
                    <div className="h-4 bg-slate-700/50 rounded w-11/12 animate-pulse" />
                    <div className="h-4 bg-slate-700/40 rounded w-4/5 animate-pulse" />
                    <div className="h-4 bg-slate-700/30 rounded w-2/3 animate-pulse" />
                  </div>
                )}

                {/* Rendered Partial or Full Content */}
                {msg.content && (
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                    {status === 'streaming' && isLast && !isUser && (
                      <span className="inline-block h-3.5 w-1.5 bg-sky-400 animate-pulse ml-1 translate-y-0.5" />
                    )}
                  </div>
                )}

                {/* DESIGNED ERROR CARD & WORKING RETRY (Buttons with a Brain) */}
                {msg.error && (
                  <div className="mt-3 rounded-xl border border-amber-500/40 bg-amber-950/20 p-3.5 text-left text-slate-200">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        <span>Stream Failure Handled</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {msg.error.code}
                      </span>
                    </div>

                    <p className="text-[11px] text-amber-200/90 leading-relaxed mb-3">
                      {msg.error.message}
                      {msg.tokens > 0 && (
                        <span className="block mt-1 text-[10px] text-slate-400 font-mono">
                          ℹ️ Partial stream retained: {msg.tokens} tokens safely captured.
                        </span>
                      )}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Retry Button with Debounce and State Choreography */}
                      <button
                        type="button"
                        onClick={() => handleRetry(msg.id, msg.error.failedPrompt)}
                        disabled={retryingMessageId === msg.id || status === 'streaming'}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-colors disabled:opacity-50 cursor-pointer"
                        title={`Retry message: "${msg.error.failedPrompt.slice(0, 30)}..."`}
                      >
                        <RefreshCw className={`h-3 w-3 ${retryingMessageId === msg.id ? 'animate-spin' : ''}`} />
                        <span>
                          {retryingMessageId === msg.id ? 'Retrying turn...' : 'Retry this response'}
                        </span>
                      </button>

                      <span className="text-[10px] text-slate-400 font-mono">
                        Target turn preserved
                      </span>
                    </div>
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
          className="absolute bottom-20 right-6 z-20 flex items-center gap-1.5 rounded-full bg-slate-800/95 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-sky-400 shadow-xl backdrop-blur hover:bg-slate-700 transition-all cursor-pointer"
        >
          <ArrowDown className="h-3.5 w-3.5" />
          <span>Scroll to latest</span>
        </button>
      )}

      {/* Input Composer & Controls (Mobile Safari Optimized) */}
      <div className="border-t border-border bg-[#090d16] p-3 sm:p-4 pb-[env(safe-area-inset-bottom,1rem)]">
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
                : 'Ask anything or test a sabotage drill above...'
            }
            disabled={status === 'streaming' || status === 'thinking'}
            className="flex-1 rounded-xl border border-border bg-[#111827] px-4 py-3 text-base sm:text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-primary disabled:opacity-60 transition-colors"
          />

          {status === 'streaming' || status === 'thinking' ? (
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all shrink-0 cursor-pointer"
              title="Stop Generation"
            >
              <Square className="h-4 w-4 fill-white" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all disabled:opacity-40 shrink-0 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          )}
        </form>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
          <span className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${sabotageMode === 'none' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span>Mode: {sabotageMode === 'none' ? 'Happy Path' : `Sabotage (${sabotageMode})`}</span>
          </span>
          <span className="hidden sm:inline">Mobile Safari Viewport Safe · Zero Secrets</span>
        </div>
      </div>
    </div>
  );
}
