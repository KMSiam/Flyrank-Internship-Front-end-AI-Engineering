'use client';

import React, { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * W3C ARIA Authoring Practices Guide (APG) Compliant Modal Dialog.
 * Patterns implemented:
 * - role="dialog", aria-modal="true"
 * - aria-labelledby & aria-describedby linkage
 * - Strict focus trap (Tab / Shift+Tab cycle)
 * - Escape key dismissal
 * - Focus return to triggering element on unmount/close
 */
export function Modal({ isOpen, onClose, title, description, children }: ModalProps): React.JSX.Element | null {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (isOpen) {
      // 1. Remember triggering element to restore focus on close
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;

      // 2. Focus first focusable element inside the dialog
      const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector);

      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        dialogRef.current?.focus();
      }
    } else {
      // 3. Return focus to trigger element when closed
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
      }
    }
  }, [isOpen]);

  // Handle Keyboard Trap & Escape Key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }

    if (e.key === 'Tab') {
      if (!dialogRef.current) return;
      const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector))
        .filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);

      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: if on first element, wrap to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0f172a] p-6 shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 id={titleId} className="text-lg font-bold text-white tracking-tight">
              {title}
            </h2>
            {description && (
              <p id={descId} className="text-xs text-slate-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {children}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Cancel (Esc)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500 focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
