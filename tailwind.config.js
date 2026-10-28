/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        royal: { DEFAULT: '#034694', 400: '#2A6BC4', 300: '#5B8FD6', 600: '#023A7A', 700: '#022D5F' },
        midnight: { DEFAULT: '#0B1736', 800: '#112150', 700: '#172B62', 600: '#1E3776' },
        ivory: { DEFAULT: '#F5F2EA', muted: '#C9CFDC' },
        silver: '#A9B4C6',
        gold: { DEFAULT: '#C9A45C', 300: '#E2C88E' },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { mega: '0.32em' },
      maxWidth: { content: '1320px' },
      transitionTimingFunction: { out: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    },
  },
  plugins: [],
};
