/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D73870',
        'primary-dark': '#B82D5C',
        'primary-light': '#FF5B96',
        ink: {
          DEFAULT: '#0A0A0A',
          soft: '#1C1C1C',
        },
        canvas: {
          DEFAULT: '#FFFFFF',
          soft: '#FAFAF9',
          sand: '#F5F2EE',
        },
        line: {
          DEFAULT: '#E7E5E4',
          soft: '#F0EEEB',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      transitionTimingFunction: {
        swift: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'blob-slow': {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(20px,-30px) scale(1.05)' },
          '66%': { transform: 'translate(-15px,20px) scale(0.95)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        shimmer: 'shimmer 2s ease-in-out infinite',
        'blob-slow': 'blob-slow 18s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
