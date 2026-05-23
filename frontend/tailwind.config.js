/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        luxe: {
          gold: '#C9A962',
          cream: '#F8F4EF',
          brown: '#3D2C1E',
          rose: '#E8D5C4',
          dark: '#1A1410',
        },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        sans: ['system-ui', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
