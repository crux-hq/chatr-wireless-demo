/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        chatr: {
          green: '#00A651',
          'green-dark': '#008542',
          yellow: '#FFD100',
          'yellow-light': '#FFF3B0',
          gray: '#F5F5F5',
          'gray-dark': '#666666',
          black: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
};
