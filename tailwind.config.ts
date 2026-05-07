import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Pastel lavender (primary)
        lavender: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Pastel mint (secondary)
        mint: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Pastel peach (accent)
        peach: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Pastel sky (info)
        sky: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Pastel rose (error / destructive)
        rose: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        // App semantic aliases
        primary:   '#c4b5fd', // lavender-300
        secondary: '#a7f3d0', // mint-200
        accent:    '#fed7aa', // peach-200
        surface:   '#faf9ff',
        muted:     '#f3f0ff',
      },
      backgroundImage: {
        'gradient-pastel':
          'linear-gradient(135deg, #ede9fe 0%, #d1fae5 50%, #ffedd5 100%)',
        'gradient-lavender-mint':
          'linear-gradient(135deg, #c4b5fd 0%, #a7f3d0 100%)',
        'gradient-mint-peach':
          'linear-gradient(135deg, #a7f3d0 0%, #fed7aa 100%)',
        'gradient-peach-lavender':
          'linear-gradient(135deg, #fed7aa 0%, #c4b5fd 100%)',
        'gradient-hero':
          'linear-gradient(135deg, #ede9fe 0%, #d1fae5 40%, #ffedd5 100%)',
        'gradient-card':
          'linear-gradient(145deg, rgba(237,233,254,0.8) 0%, rgba(209,250,229,0.8) 100%)',
        'gradient-sidebar':
          'linear-gradient(180deg, #f5f3ff 0%, #ecfdf5 100%)',
      },
      animation: {
        'fade-in':        'fadeIn 0.3s ease-in-out',
        'slide-up':       'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'bounce-gentle':  'bounceGentle 2s ease-in-out infinite',
        'pulse-soft':     'pulseSoft 3s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
        'spin-slow':      'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        slideInRight: {
          '0%':   { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'pastel-sm':  '0 1px 3px rgba(196,181,253,0.3)',
        'pastel-md':  '0 4px 12px rgba(196,181,253,0.25)',
        'pastel-lg':  '0 8px 24px rgba(196,181,253,0.2)',
        'pastel-xl':  '0 16px 48px rgba(196,181,253,0.15)',
        'mint-glow':  '0 0 20px rgba(167,243,208,0.5)',
        'lavender-glow': '0 0 20px rgba(196,181,253,0.5)',
        'peach-glow': '0 0 20px rgba(254,215,170,0.5)',
        'card':       '0 2px 16px rgba(139,92,246,0.08), 0 1px 4px rgba(139,92,246,0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '72': '18rem',
        '80': '20rem',
        '88': '22rem',
        '96': '24rem',
      },
    },
  },
  plugins: [],
}

export default config
