'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Check, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

/**
 * SmartButton Component ("Buttons with a Brain")
 * States: idle | hover/focus | loading | success | error | disabled
 * Compositor-friendly transforms & opacities.
 * Honors prefers-reduced-motion.
 * Debounced and interrupt-safe.
 */
export function SmartButton({
  label = 'Send Message',
  loadingLabel = 'Streaming...',
  successLabel = 'Delivered',
  errorLabel = 'Retry Turn',
  onAction,
  disabled = false,
  variant = 'primary', // 'primary' | 'secondary'
  className = '',
  forcedResult = null // null | 'success' | 'error' for testing triggers
}) {
  const [state, setState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [isHovered, setIsHovered] = useState(false);
  const resetTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleClick = async (e) => {
    e?.preventDefault();
    if (disabled || state === 'loading') return;

    // Clear any pending state rollback
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    setState('loading');

    try {
      if (onAction) {
        await onAction(forcedResult);
      } else {
        // Default fake async with 800ms delay and forcedResult or 20% random failure
        await new Promise(r => setTimeout(r, 750));
        if (forcedResult === 'error' || (forcedResult === null && Math.random() < 0.2)) {
          throw new Error('Simulated failure');
        }
      }

      setState('success');
      resetTimerRef.current = setTimeout(() => {
        setState('idle');
      }, 1800);
    } catch {
      setState('error');
      // On error, remain in error state until user re-clicks to retry
    }
  };

  // Theme variants
  const isPrimary = variant === 'primary';
  const baseColors = isPrimary
    ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/25 focus-visible:ring-sky-400'
    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 focus-visible:ring-emerald-400';

  let stateColors = baseColors;
  if (disabled) {
    stateColors = 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed shadow-none';
  } else if (state === 'loading') {
    stateColors = 'bg-sky-700 text-sky-100 shadow-none cursor-wait';
  } else if (state === 'success') {
    stateColors = 'bg-emerald-600 text-white shadow-emerald-600/30';
  } else if (state === 'error') {
    stateColors = 'bg-rose-600 text-white shadow-rose-600/30 hover:bg-rose-500';
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || state === 'loading'}
      aria-live="polite"
      aria-busy={state === 'loading'}
      aria-label={`${label} - Current status: ${state}`}
      className={`
        relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-medium text-xs sm:text-sm
        px-5 py-2.5 shadow-lg transition-all duration-200 ease-out select-none outline-none
        focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090d16]
        active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none
        ${state === 'error' ? 'animate-shake motion-reduce:animate-none' : ''}
        ${stateColors} ${className}
      `}
    >
      {/* Icon Choreography */}
      <div className="relative flex items-center justify-center w-4 h-4 shrink-0 transition-transform duration-200 ease-out">
        {state === 'idle' && (
          <span className="transition-all duration-200 ease-out transform opacity-100 scale-100 motion-reduce:transition-none">
            {isPrimary ? <Send className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
          </span>
        )}

        {state === 'loading' && (
          <span className="animate-spin transition-opacity duration-200 opacity-100 motion-reduce:animate-none">
            <Loader2 className="w-3.5 h-3.5" />
          </span>
        )}

        {state === 'success' && (
          <span className="transition-all duration-200 ease-out transform scale-110 opacity-100 text-white motion-reduce:transition-none">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </span>
        )}

        {state === 'error' && (
          <span className="transition-all duration-200 ease-out transform scale-100 opacity-100 text-white motion-reduce:transition-none">
            <RefreshCw className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      {/* Label Text Choreography */}
      <span className="tracking-wide transition-all duration-200 ease-out transform motion-reduce:transition-none">
        {state === 'idle' && label}
        {state === 'loading' && loadingLabel}
        {state === 'success' && successLabel}
        {state === 'error' && errorLabel}
      </span>

      {/* Subtle highlight sheen on hover */}
      {state === 'idle' && !disabled && (
        <span
          className={`
            absolute inset-0 rounded-xl bg-white/10 pointer-events-none transition-opacity duration-150 ease-out
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        />
      )}
    </button>
  );
}
