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
        carbon: {
          // Cohesive Night Transit Theme (Velvety dark midnight slate)
          bg: '#0c1017',           // Deep midnight canvas
          layer01: '#151c27',      // Primary squircle card surface
          layer02: '#1d2636',      // Elevated inputs & pills
          layer03: '#273349',      // Active & hover interactive layer
          field: '#18212f',        // Input fields
          borderSubtle: 'rgba(255, 255, 255, 0.08)', // Delicate glassmorphic border
          borderStrong: 'rgba(255, 255, 255, 0.18)',
          borderInteractive: '#38bdf8',
          
          textPrimary: '#f8fafc',  // Crisp off-white
          textSecondary: '#94a3b8',// Muted slate
          textHelper: '#64748b',   // Darker slate helper
          textOnColor: '#ffffff',
          
          // Refined Softer Colors (Less sharp, modern consumer palette)
          blue: {
            DEFAULT: '#3b82f6',
            hover: '#2563eb',
            active: '#1d4ed8',
            light: '#60a5fa',
            sky: '#38bdf8',
            subtle: 'rgba(56, 189, 248, 0.12)',
          },
          green: {
            DEFAULT: '#10b981',    // Soft emerald safe color
            hover: '#059669',
            light: '#34d399',
            subtle: 'rgba(16, 185, 129, 0.14)',
          },
          red: {
            DEFAULT: '#ef4444',    // Soft coral red
            hover: '#dc2626',
            active: '#b91c1c',
            light: '#f87171',
            subtle: 'rgba(239, 68, 68, 0.14)',
          },
          yellow: {
            DEFAULT: '#f59e0b',
            hover: '#d97706',
            light: '#fbbf24',
            subtle: 'rgba(245, 158, 11, 0.14)',
          },
          cyan: {
            DEFAULT: '#06b6d4',
            light: '#22d3ee',
          }
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'soft-sm': '0 2px 6px rgba(0, 0, 0, 0.3)',
        'soft-md': '0 8px 20px rgba(0, 0, 0, 0.4)',
        'soft-lg': '0 16px 36px rgba(0, 0, 0, 0.55)',
        'glow-green': '0 0 24px rgba(16, 185, 129, 0.25)',
        'glow-red': '0 0 24px rgba(239, 68, 68, 0.25)',
        'glow-blue': '0 0 24px rgba(56, 189, 248, 0.25)',
      },
      borderRadius: {
        'squircle-sm': '10px',
        'squircle-md': '16px',
        'squircle-lg': '24px',
        'squircle-xl': '32px',
      },
      animation: {
        'radar-pulse': 'radarPulse 2.4s cubic-bezier(0.24, 0, 0.38, 1) infinite',
        'subtle-pulse': 'subtlePulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        radarPulse: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '70%': { transform: 'scale(2.2)', opacity: '0' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
