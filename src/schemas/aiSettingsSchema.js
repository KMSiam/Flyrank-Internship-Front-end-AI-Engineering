import { z } from 'zod';

/**
 * Enterprise Zod validation schema for AI Model Preferences and Settings.
 * Implements strict format enforcement, coercion, whitespace trimming, and HTTPS safety checks.
 */
export const aiSettingsSchema = z.object({
  apiKey: z
    .string()
    .min(1, 'API key is required')
    .regex(
      /^(sk-[a-zA-Z0-9_\-]{16,}|anthropic-[a-zA-Z0-9_\-]{16,})$/,
      "API key must start with 'sk-' or 'anthropic-' followed by at least 16 alphanumeric characters"
    ),

  model: z.enum([
    'claude-3-7-sonnet',
    'claude-3-5-haiku',
    'gpt-4o',
    'gemini-1.5-pro'
  ], {
    errorMap: () => ({ message: 'Please select a supported enterprise AI model' })
  }),

  temperature: z.coerce
    .number({ invalid_type_error: 'Temperature must be a valid number' })
    .min(0.0, 'Temperature cannot be negative (min: 0.0)')
    .max(1.0, 'Temperature cannot exceed 1.0'),

  maxTokens: z.coerce
    .number({ invalid_type_error: 'Max tokens must be an integer' })
    .int('Max tokens must be a whole number')
    .min(256, 'Max tokens must be at least 256')
    .max(8192, 'Max tokens cannot exceed 8,192'),

  systemPrompt: z
    .string()
    .trim()
    .min(10, 'System prompt must contain at least 10 non-whitespace characters')
    .max(2000, 'System prompt cannot exceed 2,000 characters'),

  streamResponse: z.boolean().default(true),

  webhookUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((val) => {
      if (!val || val === '') return true;
      try {
        const parsed = new URL(val);
        return parsed.protocol === 'https:';
      } catch {
        return false;
      }
    }, 'Webhook URL must be a valid HTTPS URL (e.g. https://api.enterprise.com/events)')
});

export const DEFAULT_AI_SETTINGS = {
  apiKey: '',
  model: 'claude-3-7-sonnet',
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt: 'You are an expert AI engineering assistant specializing in accessible frontend architectures.',
  streamResponse: true,
  webhookUrl: ''
};
