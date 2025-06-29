/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: '#F3A455',
        secondary: '#fcf464',
        placeholder_color: '#C6C2C2',
        background_light: '#FFEFE0',
        orangeSoft: '#fcd9b6',     
        orangeHover: '#f8b26a',    
        orangeActive: '#f59e42',   
        
      },
      fontFamily: {
        primary: ['Open Sans', 'sans-serif']

      },
    },
  },
  plugins: [],
}

