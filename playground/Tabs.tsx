'use client';

import React, { useState, useRef, useId } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  ariaLabel?: string;
}

/**
 * W3C ARIA Authoring Practices Guide (APG) Compliant Tabs.
 * Patterns implemented:
 * - role="tablist", role="tab", role="tabpanel"
 * - aria-selected, aria-controls, aria-labelledby
 * - Roving tabindex (active = 0, inactive = -1)
 * - Keyboard navigation: ArrowRight / ArrowLeft (cycling), Home, End
 * - Automatic focus activation on keyboard navigation
 */
export function Tabs({ tabs, defaultTabId, ariaLabel = 'Content tabs' }: TabsProps): React.JSX.Element {
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabId || tabs[0]?.id || '');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const activeIndex = Math.max(0, tabs.findIndex(t => t.id === activeTabId));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let newIndex = activeIndex;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (activeIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = (activeIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    const nextTab = tabs[newIndex];
    if (nextTab) {
      setActiveTabId(nextTab.id);
      tabRefs.current[newIndex]?.focus();
    }
  };

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  return (
    <div className="w-full space-y-4">
      {/* Tab List */}
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className="flex border-b border-slate-800 bg-[#090d16] p-1 rounded-xl border"
      >
        {tabs.map((tab, idx) => {
          const isSelected = tab.id === activeTabId;
          const tabElementId = `${baseId}-tab-${tab.id}`;
          const panelElementId = `${baseId}-panel-${tab.id}`;

          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[idx] = el; }}
              role="tab"
              id={tabElementId}
              aria-selected={isSelected}
              aria-controls={panelElementId}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex-1 rounded-lg px-4 py-2 text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                isSelected
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {tabs.map((tab) => {
        const isSelected = tab.id === activeTabId;
        const tabElementId = `${baseId}-tab-${tab.id}`;
        const panelElementId = `${baseId}-panel-${tab.id}`;

        if (!isSelected) return null;

        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={panelElementId}
            aria-labelledby={tabElementId}
            tabIndex={0}
            className="rounded-xl border border-slate-800 bg-[#0f172a] p-5 text-xs sm:text-sm text-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 animate-in fade-in duration-150"
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
}
