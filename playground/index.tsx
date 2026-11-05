'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Tabs } from './Tabs';
import { Disclosure } from './Disclosure';
import { ShieldCheck, Keyboard, Sparkles, Layers } from 'lucide-react';

export default function AccessiblePlayground(): React.JSX.Element {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const sampleTabs = [
    {
      id: 'tab-wcag',
      label: 'WCAG 2.1 AA Spec',
      content: (
        <div className="space-y-2">
          <h4 className="font-bold text-white">W3C ARIA Tab Patterns</h4>
          <p className="text-slate-300">
            Use <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-sky-400">ArrowLeft</kbd> and{' '}
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-sky-400">ArrowRight</kbd> to cycle between tabs with roving tabindex.
            Press <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-sky-400">Home</kbd> or{' '}
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-sky-400">End</kbd> to jump to the extremities.
          </p>
        </div>
      )
    },
    {
      id: 'tab-keyboard',
      label: 'Keyboard Invariants',
      content: (
        <div className="space-y-2">
          <h4 className="font-bold text-white">Full Keyboard Navigation</h4>
          <p className="text-slate-300">
            Every component in this playground operates 100% without a mouse pointer. Focus indicators are rendered with high-contrast rings (minimum 3:1 ratio).
          </p>
        </div>
      )
    },
    {
      id: 'tab-focus',
      label: 'Focus Management',
      content: (
        <div className="space-y-2">
          <h4 className="font-bold text-white">Trapping & Restoration</h4>
          <p className="text-slate-300">
            Opening a modal saves the active trigger reference and traps Tab cycles within the dialog frame. Closing via Escape restores focus seamlessly.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
          <Keyboard className="h-4 w-4" />
          <span>FE-05 · Accessible Component Fundamentals</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Hand-Crafted Accessible Component Playground
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Three interactive components built from scratch in React + TypeScript adhering to W3C ARIA Authoring Practices Guide (APG) standards without external component libraries.
        </p>
      </div>

      {/* Component 1: Modal Dialog */}
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-[#0b0f19] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">1. Accessible Modal Dialog</h2>
            <p className="text-xs text-slate-400">Features strict focus trap, Escape dismissal, and return focus on close.</p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500 focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Open Test Modal
          </button>
        </div>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Inference Engine Quota Alert"
          description="A dialog demonstrating strict focus trapping and keyboard navigation."
        >
          <div className="space-y-3">
            <p>
              When this modal opens, keyboard focus is trapped inside. Pressing <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-sky-400">Tab</kbd> or{' '}
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-sky-400">Shift+Tab</kbd> will cycle through buttons. Pressing{' '}
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-sky-400">Escape</kbd> closes it and returns focus to the trigger button.
            </p>
            <input
              type="text"
              placeholder="Interactive test input..."
              className="w-full rounded-lg border border-slate-700 bg-[#090d16] px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500"
            />
          </div>
        </Modal>
      </section>

      {/* Component 2: Tabs */}
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-[#0b0f19] p-6">
        <div>
          <h2 className="text-base font-bold text-white">2. Accessible Tabs Widget</h2>
          <p className="text-xs text-slate-400">Uses roving tabindex with ArrowLeft/ArrowRight, Home, and End keyboard cycling.</p>
        </div>

        <Tabs tabs={sampleTabs} ariaLabel="Accessibility Specifications" />
      </section>

      {/* Component 3: Disclosure */}
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-[#0b0f19] p-6">
        <div>
          <h2 className="text-base font-bold text-white">3. Accessible Disclosure Widget</h2>
          <p className="text-xs text-slate-400">Native button trigger with aria-expanded, aria-controls, and Enter/Space keyboard toggling.</p>
        </div>

        <div className="space-y-2">
          <Disclosure title="What is the difference between custom A11y and shadcn/ui?">
            <p>
              Shadcn/ui (powered by Radix Primitives) adds automated DOM portal rendering to document.body, layout shift compensation on scroll locks, and screen reader sibling inerting via aria-hidden.
            </p>
          </Disclosure>

          <Disclosure title="Why avoid 'any' escapes in component props?">
            <p>
              Using strict TypeScript interfaces ensures compile-time contracts are honored and prevents subtle accessibility regressions like missing aria labels or event handlers.
            </p>
          </Disclosure>
        </div>
      </section>
    </div>
  );
}
