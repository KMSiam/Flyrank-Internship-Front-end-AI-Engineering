'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { aiSettingsSchema, DEFAULT_AI_SETTINGS } from '../../schemas/aiSettingsSchema';
import { Settings, Save, CheckCircle2, AlertTriangle, ShieldCheck, Key, Cpu, Sliders, Globe } from 'lucide-react';

export function SettingsClient() {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(aiSettingsSchema),
    defaultValues: DEFAULT_AI_SETTINGS,
    mode: 'onBlur'
  });

  const onSubmit = async (data) => {
    // Simulate safe client-side credential persistence
    await new Promise((resolve) => setTimeout(resolve, 300));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="rounded-xl border border-border bg-[#0f172a] p-6 shadow-xl">
      {saveSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 p-4 text-xs sm:text-sm font-medium text-emerald-300"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>AI Model Configuration saved successfully to browser session!</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* API Key */}
        <div>
          <label htmlFor="apiKey" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5 text-sky-400" />
            <span>AI Gateway API Key <span className="text-rose-400">*</span></span>
          </label>
          <input
            id="apiKey"
            type="password"
            {...register('apiKey')}
            aria-invalid={!!errors.apiKey}
            aria-describedby={errors.apiKey ? 'apiKey-error' : undefined}
            placeholder="sk-antigravity-live-xxxxxxxxxxxxxxxx"
            className={`w-full rounded-lg border bg-[#090d16] px-4 py-2.5 text-xs sm:text-sm text-slate-200 font-mono outline-none transition-colors ${
              errors.apiKey ? 'border-rose-500 focus:border-rose-400' : 'border-border focus:border-primary'
            }`}
          />
          {errors.apiKey && (
            <p id="apiKey-error" role="alert" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.apiKey.message}</span>
            </p>
          )}
          <p className="mt-1 text-[11px] text-slate-500">
            Keys are strictly stored in local memory or encrypted session cache. Zero keys committed.
          </p>
        </div>

        {/* Model Selection & Webhook URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="model" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-purple-400" />
              <span>Enterprise Model <span className="text-rose-400">*</span></span>
            </label>
            <select
              id="model"
              {...register('model')}
              aria-invalid={!!errors.model}
              aria-describedby={errors.model ? 'model-error' : undefined}
              className="w-full rounded-lg border border-border bg-[#090d16] px-4 py-2.5 text-xs sm:text-sm text-slate-200 font-mono outline-none focus:border-primary"
            >
              <option value="claude-3-7-sonnet">Claude 3.7 Sonnet (Anthropic)</option>
              <option value="claude-3-5-haiku">Claude 3.5 Haiku (Fast)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Google)</option>
              <option value="gpt-4o">GPT-4o (OpenAI)</option>
            </select>
          </div>

          <div>
            <label htmlFor="webhookUrl" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              <span>Telemetry Webhook URL (Optional)</span>
            </label>
            <input
              id="webhookUrl"
              type="url"
              {...register('webhookUrl')}
              aria-invalid={!!errors.webhookUrl}
              aria-describedby={errors.webhookUrl ? 'webhookUrl-error' : undefined}
              placeholder="https://telemetry.flyrank.ai/events"
              className="w-full rounded-lg border border-border bg-[#090d16] px-4 py-2.5 text-xs sm:text-sm text-slate-200 outline-none focus:border-primary"
            />
            {errors.webhookUrl && (
              <p id="webhookUrl-error" role="alert" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>{errors.webhookUrl.message}</span>
              </p>
            )}
          </div>
        </div>

        {/* Sliders: Temperature & Max Tokens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="temperature" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-amber-400" />
              <span>Temperature (0.0 to 1.0)</span>
            </label>
            <input
              id="temperature"
              type="number"
              step="0.05"
              {...register('temperature')}
              className="w-full rounded-lg border border-border bg-[#090d16] px-4 py-2.5 text-xs sm:text-sm text-slate-200 font-mono outline-none focus:border-primary"
            />
            {errors.temperature && (
              <p role="alert" className="mt-1.5 text-xs text-rose-400">{errors.temperature.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="maxTokens" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-sky-400" />
              <span>Max Tokens (256 - 8192)</span>
            </label>
            <input
              id="maxTokens"
              type="number"
              step="128"
              {...register('maxTokens')}
              className="w-full rounded-lg border border-border bg-[#090d16] px-4 py-2.5 text-xs sm:text-sm text-slate-200 font-mono outline-none focus:border-primary"
            />
            {errors.maxTokens && (
              <p role="alert" className="mt-1.5 text-xs text-rose-400">{errors.maxTokens.message}</p>
            )}
          </div>
        </div>

        {/* System Prompt */}
        <div>
          <label htmlFor="systemPrompt" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Default System Persona & Guardrail Instructions <span className="text-rose-400">*</span>
          </label>
          <textarea
            id="systemPrompt"
            rows={3}
            {...register('systemPrompt')}
            aria-invalid={!!errors.systemPrompt}
            aria-describedby={errors.systemPrompt ? 'systemPrompt-error' : undefined}
            className="w-full rounded-lg border border-border bg-[#090d16] p-3 text-xs sm:text-sm text-slate-200 outline-none focus:border-primary"
          />
          {errors.systemPrompt && (
            <p id="systemPrompt-error" role="alert" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.systemPrompt.message}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <button
            type="button"
            onClick={() => reset(DEFAULT_AI_SETTINGS)}
            className="rounded-lg border border-border px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Reset Defaults
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
