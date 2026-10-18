/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        radiant: {
          dark: '#070b14',
          card: '#0d1527',
          surface: '#131e36',
          border: 'rgba(56, 189, 248, 0.15)',
          blue: '#2563eb',
          'blue-bright': '#3b82f6',
          sky: '#0ea5e9',
          'sky-light': '#38bdf8',
          crimson: '#e11d48',
          'crimson-light': '#fb7185',
          'crimson-glow': 'rgba(225, 29, 72, 0.35)',
        }
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        'spin-arm': 'armPivot 0.8s ease-in-out forwards',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'waveform': 'waveHeight 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        waveHeight: {
          '0%': { height: '15%' },
          '100%': { height: '100%' }
        }
      },
      boxShadow: {
        'glow-sky': '0 0 25px -5px rgba(14, 165, 233, 0.4)',
        'glow-crimson': '0 0 25px -5px rgba(225, 29, 72, 0.45)',
        'glow-blue': '0 0 30px -5px rgba(37, 99, 235, 0.5)',
        'vinyl': '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 35px -5px rgba(14, 165, 233, 0.25)',
      }
    },
  },
  plugins: [],
}
