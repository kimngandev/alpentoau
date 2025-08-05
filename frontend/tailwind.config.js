// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // bật class‐based dark mode
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layout/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // chính là tông tím của logo
        primary: {
          50:  '#f4f0ff',
          100: '#e1d9ff',
          200: '#c8b3ff',
          300: '#ad89ff',
          400: '#9b60ff',
          500: '#7f5ee5', // main
          600: '#5e34cc',
          700: '#451e99',
          800: '#2d1166',
          900: '#1b0a33'
        }
      }
    }
  },
  plugins: []
}
