/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // One content width everywhere so header, sections and footer align up to large desktops
    container: {
      center: true,
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1320px' },
    },
    extend: {
      colors: {
        // Night palette taken from the hero illustration
        'bg-primary': '#0A0618',
        'bg-secondary': '#120A2A',
        night: { 950: '#07040F', 900: '#0A0618', 800: '#120A2A', 700: '#1C1240', 600: '#2A1D57' },
        glow: '#5EEAD4', // monitor glow
        volt: '#8B5CF6', // violet
        leaf: '#34D399', // desk plants
        'text-main': '#EEEAFB',
        'text-muted': '#A49CC2',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Geist', 'system-ui', 'sans-serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        twinkle: 'twinkle 3s infinite ease-in-out',
        marquee: 'marquee 40s linear infinite',
        'border-spin': 'border-spin 6s linear infinite',
        'pulse-dot': 'pulse-dot 2s ease-out infinite',
        caret: 'caret 1s steps(1) infinite',
        'screen-breathe': 'screen-breathe 5s ease-in-out infinite',
        'nebula-drift': 'nebula-drift 40s ease-in-out infinite alternate',
        orbit: 'orbit var(--orbit-dur, 40s) linear infinite',
        'orbit-rev': 'orbit var(--orbit-dur, 40s) linear infinite reverse',
      },
      keyframes: {
        twinkle: { '0%, 100%': { opacity: 0.8 }, '50%': { opacity: 0.2 } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'border-spin': { to: { '--angle': '360deg' } },
        'pulse-dot': {
          '0%': { boxShadow: '0 0 0 0 rgba(52,211,153,.6)' },
          '100%': { boxShadow: '0 0 0 10px rgba(52,211,153,0)' },
        },
        caret: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        'screen-breathe': { '0%,100%': { opacity: 0.7 }, '50%': { opacity: 1 } },
        'nebula-drift': { from: { transform: 'translate3d(-3%, -2%, 0) scale(1)' }, to: { transform: 'translate3d(3%, 2%, 0) scale(1.08)' } },
        orbit: { to: { transform: 'rotate(360deg)' } },
        float: { '0%,100%': { translate: '0 0' }, '50%': { translate: '0 -6px' } },
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(100deg, #5EEAD4 0%, #8B5CF6 100%)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
