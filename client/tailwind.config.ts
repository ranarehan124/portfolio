import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
          DEFAULT: '#8B5CF6',
        },
        accent: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
          DEFAULT: '#60A5FA',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          50: '#18181B',
          100: '#141416',
          200: '#111113',
          300: '#0E0E10',
          400: '#0B0B0D',
          500: '#0A0A0A',
          600: '#080808',
          700: '#060606',
          800: '#040404',
          900: '#020202',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.05)',
          medium: 'rgba(255, 255, 255, 0.08)',
          heavy: 'rgba(255, 255, 255, 0.12)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'hero-xl': [
          'clamp(3rem, 8vw, 8rem)',
          { lineHeight: '0.95', letterSpacing: '-0.03em' },
        ],
        'hero-lg': [
          'clamp(2.5rem, 6vw, 6rem)',
          { lineHeight: '1', letterSpacing: '-0.025em' },
        ],
        'hero-md': [
          'clamp(2rem, 4vw, 4rem)',
          { lineHeight: '1.1', letterSpacing: '-0.02em' },
        ],
        'section-xl': [
          'clamp(2rem, 4vw, 3.5rem)',
          { lineHeight: '1.1', letterSpacing: '-0.02em' },
        ],
        'section-lg': [
          'clamp(1.5rem, 3vw, 2.5rem)',
          { lineHeight: '1.2', letterSpacing: '-0.015em' },
        ],
        'body-lg': ['clamp(1.125rem, 1.5vw, 1.375rem)', { lineHeight: '1.7' }],
        'body-md': ['clamp(1rem, 1.25vw, 1.125rem)', { lineHeight: '1.7' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        section: 'clamp(4rem, 10vh, 8rem)',
        'section-lg': 'clamp(6rem, 15vh, 12rem)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glow-purple':
          '0 0 40px rgba(139, 92, 246, 0.3), 0 0 80px rgba(139, 92, 246, 0.1)',
        'glow-accent':
          '0 0 40px rgba(96, 165, 250, 0.3), 0 0 80px rgba(96, 165, 250, 0.1)',
        'glow-soft': '0 0 60px rgba(139, 92, 246, 0.15)',
        glass:
          '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'glass-lg':
          '0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
        'glass-heavy': '24px',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      containers: {
        sm: { maxWidth: '640px' },
        md: { maxWidth: '768px' },
        lg: { maxWidth: '1024px' },
        xl: { maxWidth: '1280px' },
        '2xl': { maxWidth: '1536px' },
      },
    },
  },
  plugins: [],
};

export default config;