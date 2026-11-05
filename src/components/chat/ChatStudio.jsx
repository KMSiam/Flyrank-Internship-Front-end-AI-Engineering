'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Bot, User, Sparkles, RefreshCw, AlertCircle, Cpu, Zap, Activity } from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Welcome to the Streaming AI Chat Studio. Powered by Google Antigravity (Gemini 3.8 Flash High). How can I assist your frontend architecture today?',
    timestamp: '12:00 PM',
    tokens: 34
  }
];

export function ChatStudio() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');
  const [selectedPersona, setSelectedPersona] = useState('Senior Frontend AI Architect');

  const streamTimerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, []);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tokens: Math.ceil(input.split(' ').length * 1.33)
    };

    const promptText = input;
    setInput('');
    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);

    const botMessageId = `bot-${Date.now()}`;
    const initialBotMessage = {
      id: botMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tokens: 0
    };

    setMessages(prev => [...prev, initialBotMessage]);

    // Simulated streaming response tailored to prompt
    const mockReply = `Analyzing "${promptText}" through the lens of ${selectedPersona}...\n\n1. **Boundary Validation**: Ensure inputs are validated at API boundaries via Zod schemas.\n2. **Component Separation**: Use Server Components for initial payload streaming, delegating interactivity to Client boundaries.\n3. **Telemetry & Governance**: Monitor latency percentiles and token spend against allocated budget thresholds.\n\nEverything is operating within nominal parameters.`;
    const tokens = mockReply.split(' ');
    let tokenIndex = 0;

    streamTimerRef.current = setInterval(() => {
      if (tokenIndex < tokens.length) {
        const nextWord = (tokenIndex === 0 ? '' : ' ') + tokens[tokenIndex];
        setMessages(prev => prev.map(msg => {
          if (msg.id === botMessageId) {
            return {
              ...msg,
              content: msg.content + nextWord,
              tokens: Math.ceil((msg.content + nextWord).split(' ').length * 1.33)
            };
          }
          return msg;
        }));
        tokenIndex++;
      } else {
        clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
        setIsStreaming(false);
      }
    }, 40);
  };

  const handleAbort = () => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    setIsStreaming(false);
  };

  return (
    <div className="flex flex-col h-[700px] rounded-xl border border-border bg-[#0f172a] overflow-hidden shadow-xl">
      {/* Top Configuration Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-[#090d16] p-3.5 sm:px-5">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-sky-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Streaming Chat Engine
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Persona selector */}
          <select
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
            className="rounded-md border border-border bg-[#111827] px-2.5 py-1 text-xs text-slate-300 outline-none focus:border-primary"
            aria-label="Select AI Persona"
          >
            <option value="Senior Frontend AI Architect">Architect Persona</option>
            <option value="Regulatory Legal Auditor">Legal Auditor</option>
            <option value="FinOps Cost Optimizer">FinOps Optimizer</option>
          </select>

          {/* Model selector */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="rounded-md border border-border bg-[#111827] px-2.5 py-1 text-xs text-sky-400 font-mono outline-none focus:border-primary"
            aria-label="Select Model"
          >
            <option value="gemini-3.8-flash">Gemini 3.8 Flash High</option>
            <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
            <option value="gpt-4o">OpenAI GPT-4o</option>
          </select>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                isUser
                  ? 'bg-sky-600 text-white'
                  : 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-400'
              }`}>
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                isUser
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-[#162036] text-slate-200 border border-border rounded-tl-none whitespace-pre-wrap'
              }`}>
                <div>{msg.content || (isStreaming && <span className="inline-block h-3 w-1.5 bg-sky-400 animate-pulse ml-0.5" />)}</div>
                <div className={`mt-2 flex items-center gap-2 text-[10px] ${isUser ? 'text-sky-200' : 'text-slate-500'}`}>
                  <span>{msg.timestamp}</span>
                  <span>•</span>
                  <span>{msg.tokens} tokens</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div className="border-t border-border bg-[#090d16] p-3 sm:p-4">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message to test streaming token backpressure..."
            disabled={isStreaming}
            className="flex-1 rounded-lg border border-border bg-[#111827] px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-primary disabled:opacity-50"
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={handleAbort}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
            >
              <Square className="h-3.5 w-3.5 fill-white" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
