/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0C10',
          900: '#0A0C10',
          800: '#101319',
          700: '#161A22',
          600: '#1E232D',
          500: '#272D39',
        },
        mist: {
          DEFAULT: '#ECEBE3',
          muted: '#A7ACB6',
          dim: '#6E7480',
        },
        ember: {
          DEFAULT: '#E7B563',
          bright: '#F3CC82',
          deep: '#C8923B',
          glow: '#FFE3A8',
        },
      },
      fontFamily: {
        display: ['"Cabinet Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"General Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        site: '1200px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.55' },
          '50%': { transform: 'scale(1.06)', opacity: '0.9' },
        },
        'drift': {
          '0%': { transform: 'translate3d(0,0,0) scale(1.05)' },
          '100%': { transform: 'translate3d(-2%, -1%, 0) scale(1.12)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'breathe': 'breathe 7s ease-in-out infinite',
        'drift': 'drift 28s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.2s linear infinite',
      },
    },
  },
  plugins: [],
};
