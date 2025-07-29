/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0d0d0f',
        'bg-secondary': '#0e002a',
        'text-main': '#f8fafc',
        'text-muted': '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'twinkle': 'twinkle 3s infinite ease-in-out',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 0.2 },
        },
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};