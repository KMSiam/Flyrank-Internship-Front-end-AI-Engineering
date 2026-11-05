import React from 'react';
import { StreamingChat } from '../../components/chat/StreamingChat';
import { MessageSquare, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Streaming Chat Studio (FE-06) — FlyRank Frontend AI',
  description: 'Multi-turn conversational AI interface with real-time token streaming, thinking indicator handoff, resilient auto-scroll, and abort controls.',
};

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
          <MessageSquare className="h-4 w-4" />
          <span>Core Capstone Screen · FE-06 Streaming Chat</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Streaming AI Chat Studio
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Production streaming interface built on Server-Sent Events (SSE). Demonstrating token-by-token emission, thinking indicator handoff, working stop button, and user-aware auto-scroll pinning.
        </p>
      </div>

      <StreamingChat />
    </div>
  );
}
