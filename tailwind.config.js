/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
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
        dark: {
          50: '#0a0a0b',
          100: '#141418',
          200: '#1e1e24',
          300: '#2a2a32',
          400: '#3a3a44',
          500: '#4d4d59',
          600: '#6b6b78',
          700: '#9a9aa7',
          800: '#c4c4d0',
          900: '#e8e8ed',
        },
        accent: {
          purple: '#a855f7',
          pink: '#ec4899',
          green: '#10b981',
          orange: '#f59e0b',
          cyan: '#06b6d4',
          emerald: '#059669',
          violet: '#7c3aed',
          rose: '#f43f5e',
        },
        neon: {
          blue: '#00d4ff',
          purple: '#b24bf3',
          pink: '#ff0080',
          green: '#00ff88',
          yellow: '#ffff00',
          cyan: '#00ffff',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)',
        'neon-glow': 'radial-gradient(circle at center, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in': 'slideIn 0.6s ease-out',
        'cyber-flicker': 'cyberFlicker 0.15s infinite linear alternate',
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
        pulseGlow: {
          '0%': { boxShadow: '0 0 5px rgba(14, 165, 233, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.8)' },
        },
        neonPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
            filter: 'brightness(1)'
          },
          '50%': { 
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
            filter: 'brightness(1.2)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { filter: 'brightness(1) drop-shadow(0 0 5px rgba(168, 85, 247, 0.5))' },
          '100%': { filter: 'brightness(1.2) drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        cyberFlicker: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0.95' },
        },
      },
      boxShadow: {
        'neon': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        'neon-sm': '0 0 5px currentColor, 0 0 10px currentColor',
        'cyber': '0 0 20px rgba(0, 212, 255, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.4)',
        'glow-blue': '0 0 20px rgba(0, 212, 255, 0.4)',
      },
    },
  },
  plugins: [],
} 