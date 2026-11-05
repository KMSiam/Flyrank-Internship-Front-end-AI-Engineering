/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#090d16',
        canvas: '#0b0f19',
        card: '#0f172a',
        'card-hover': '#162036',
        panel: '#111827',
        border: '#1e293b',
        'border-light': '#334155',
        primary: {
          DEFAULT: '#0284c7',
          hover: '#0369a1',
          foreground: '#f8fafc',
        },
        sky: {
          400: '#38bdf8',
          500: '#0ea5e9',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
        },
        purple: {
          400: '#c084fc',
          500: '#a855f7',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Menlo', 'monospace'],
      },
      screens: {
        mobile: '375px',
        desktop: '1280px',
      },
    },
  },
  plugins: [],
};
