/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aura: {
          black: '#0D0D0D',
          dark: '#141414',
          charcoal: '#222222',
          grey: '#555555',
          lightgrey: '#E8E8E6',
          beige: '#F5F2EB',
          offwhite: '#FAFAF8',
          accent: '#C5A880', // Elegant Warm Champagne Gold
          accentHover: '#B29367',
          crimson: '#D9383A'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Syne', 'Cabinet Grotesk', 'sans-serif']
      },
      letterSpacing: {
        widest2: '.25em',
      }
    },
  },
  plugins: [],
}
