/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        chatr: {
          purple: '#5F3296',
          'purple-dark': '#4B2882',
          charcoal: '#2D263B',
          'purple-light': '#7B4BB9',
          accent: '#FFB81C',
          lavender: '#F3F0FF',
          'lavender-mid': '#E8E0F5',
          muted: '#6B6280',
        },
      },
      borderRadius: {
        card: '20px',
        button: '10px',
        pill: '9999px',
      },
      fontFamily: {
        sans: ['Poppins_400Regular', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
