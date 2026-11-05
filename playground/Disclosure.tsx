'use client';

import React, { useState, useId } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DisclosureProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/**
 * W3C ARIA Authoring Practices Guide (APG) Compliant Disclosure.
 * Patterns implemented:
 * - Trigger: native button element with aria-expanded & aria-controls
 * - Region: role="region" linked via aria-labelledby
 * - Keyboard interaction: native button activation via Enter & Space
 * - CSS animated chevron transition
 */
export function Disclosure({ title, defaultOpen = false, children }: DisclosureProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const buttonId = useId();
  const panelId = useId();

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#0f172a] overflow-hidden">
      {/* Disclosure Trigger Button */}
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-white hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition-colors"
        >
          <span>{title}</span>
          <ChevronDown
            className={`h-4 w-4 text-sky-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </h3>

      {/* Expandable Disclosure Panel */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className={`p-4 border-t border-slate-800/80 bg-[#090d16] text-xs text-slate-300 leading-relaxed ${
          isOpen ? 'block animate-in fade-in duration-150' : 'hidden'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
