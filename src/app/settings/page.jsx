import React from 'react';
import { SettingsClient } from '../../components/settings/SettingsClient';
import { Settings, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'AI Model & System Settings — FlyRank Frontend AI',
  description: 'Schema-validated AI settings form with WCAG 2.1 AA accessibility and zero secrets stored in code.',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
          <Settings className="h-4 w-4" />
          <span>Core Capstone Screen · Screen 6</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          AI Model & System Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Carrying forward the FE-03 verified pattern: React Hook Form + Zod schema validation with full WCAG 2.1 AA accessible labels, ARIA alerts, and zero committed secrets.
        </p>
      </div>

      <SettingsClient />
    </div>
  );
}
