/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        azure: {
          DEFAULT: '#0078D4',
          50: '#8DCDFF',
          100: '#78C5FF',
          200: '#4FB3FF',
          300: '#27A1FF',
          400: '#008FFD',
          500: '#0078D4',
          600: '#00589C',
          700: '#003864',
          800: '#00192C',
          900: '#000000'
        }
      }
    }
  },
  plugins: [require('daisyui')]
}
