/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:    '#2F5D50',
        secondary:  '#8FAE9D',
        accent:     '#D4A64A',
        'hover-green': '#244A40',
        brand: {
          primary:   '#2F5D50',
          secondary: '#8FAE9D',
          accent:    '#D4A64A',
          bg:        '#FAFAF8',
          altBg:     '#F2F4F3',
          heading:   '#1F2937',
          body:      '#4B5563',
          border:    '#E5E7EB',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        stats:   ['Montserrat', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '1280px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'marquee':       'marquee 35s linear infinite',
        'float':         'float 6s ease-in-out infinite',
        'pulse-slow':    'pulse 3s ease-in-out infinite',
        'spin-slow':     'spin 3s linear infinite',
        'bounce-gentle': 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
      boxShadow: {
        'brand':  '0 4px 24px rgba(47, 93, 80, 0.12)',
        'gold':   '0 4px 24px rgba(212, 166, 74, 0.20)',
        'card':   '0 2px 12px rgba(0,0,0,0.06)',
        'nav':    '0 4px 20px rgba(0,0,0,0.08)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}