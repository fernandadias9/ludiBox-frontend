/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: '#F3A455',
        placeholder_color: '#C6C2C2'
      },
      fontFamily: {
        primary: ['Open Sans', 'sans-serif']
      },
    },
  },
  plugins: [],
}

