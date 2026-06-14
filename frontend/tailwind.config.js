/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#e63946', // Primary RaktDaan red
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        navy: {
          50: '#f4f6f8',
          100: '#e1e6ed',
          200: '#c5d2df',
          300: '#9cb5c9',
          400: '#6b90ab',
          500: '#4d7490',
          600: '#3e5c75',
          700: '#334b60',
          800: '#2d3f50',
          900: '#1d3557', // Primary dark blue
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
