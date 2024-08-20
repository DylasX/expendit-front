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
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          100: '#E5E6E7',
          200: '#C0C2C4',
          300: '#9B9FA2',
          400: '#51585E',
          500: '#070F17',
          600: '#060E15',
          700: '#040B10',
          800: '#03080C',
          900: '#02060A',
        },
        secondary: {
          100: '#3E3E3E',
          200: '#1B1B1B',
          300: '#080808',
          400: '#060606',
          500: '#040404',
          600: '#030303',
          700: '#020202',
          800: '#010101',
          900: '#000000',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('tailwindcss-animated'), require('flowbite/plugin')],
};
