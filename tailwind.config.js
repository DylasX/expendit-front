/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito Variable', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#d5f7e6',
          100: '#aaf0c1',
          200: '#7eeb9d',
          300: '#4ade80',
          400: '#28c763',
          500: '#1e9f4d',
          600: '#1a8c41',
          700: '#147528',
          800: '#0f5f1a',
          900: '#0b4b13',
        },
        customDark: {
          100: '#222222',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-animated'),
    require('flowbite/plugin'),
    require('tailwindcss-safe-area-capacitor'),
  ],
};
