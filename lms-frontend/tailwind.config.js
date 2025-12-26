// tailwind.config.js
// Tailwind CSS configuration with blue-green theme for Vite

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Blue Colors
        primary: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da7ff',
          400: '#1a8eff',
          500: '#0074e6',  // Main primary blue
          600: '#005bb3',
          700: '#004280',
          800: '#00294d',
          900: '#00101a',
        },
        // Secondary Green Colors
        secondary: {
          50: '#e6f9f2',
          100: '#b3ecd9',
          200: '#80dfc0',
          300: '#4dd2a7',
          400: '#1ac58e',
          500: '#00b874',  // Main secondary green
          600: '#00905a',
          700: '#006840',
          800: '#004026',
          900: '#00180c',
        },
        // Accent Teal Colors (Blue-Green mix)
        accent: {
          50: '#e6f7f9',
          100: '#b3e7ed',
          200: '#80d7e1',
          300: '#4dc7d5',
          400: '#1ab7c9',
          500: '#00a7bd',  // Main accent teal
          600: '#008194',
          700: '#005b6b',
          800: '#003542',
          900: '#000f19',
        },
        // Status Colors
        success: {
          light: '#4ade80',
          DEFAULT: '#22c55e',
          dark: '#16a34a',
        },
        warning: {
          light: '#fbbf24',
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        error: {
          light: '#f87171',
          DEFAULT: '#ef4444',
          dark: '#dc2626',
        },
        info: {
          light: '#60a5fa',
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
        // Neutral Colors
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'mono': ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 10px 0 rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px 0 rgba(0, 0, 0, 0.08)',
        'hard': '0 10px 40px 0 rgba(0, 0, 0, 0.15)',
        'primary': '0 4px 14px 0 rgba(0, 116, 230, 0.3)',
        'secondary': '0 4px 14px 0 rgba(0, 184, 116, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}