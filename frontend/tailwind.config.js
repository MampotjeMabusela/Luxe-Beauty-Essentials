/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
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
      maxWidth: {
        site: '80rem',
      },
      spacing: {
        'safe-b': 'env(safe-area-inset-bottom, 0px)',
        'safe-r': 'env(safe-area-inset-right, 0px)',
      },
    },
  },
  plugins: [],
};
