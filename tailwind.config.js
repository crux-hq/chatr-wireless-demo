/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        chatr: {
          purple: '#542E91',
          'purple-dark': '#432474',
          charcoal: '#2D263B',
          'purple-light': '#6E46B0',
          accent: '#FFB81C',
          lavender: '#F3F0FF',
          'lavender-mid': '#E8E0F5',
          muted: '#6B6280',
        },
      },
      borderRadius: {
        card: '20px',
        button: '16px',
        pill: '9999px',
      },
      fontFamily: {
        sans: ['SantralRegular', 'system-ui', 'sans-serif'],
        regular: ['SantralRegular', 'system-ui', 'sans-serif'],
        medium: ['SantralMedium', 'system-ui', 'sans-serif'],
        semibold: ['SantralSemiBold', 'system-ui', 'sans-serif'],
        bold: ['SantralBold', 'system-ui', 'sans-serif'],
        extrabold: ['SantralExtraBold', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
