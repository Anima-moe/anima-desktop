/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#161616',
        secondary: '#212121',
        tertiary: '#2E2E2E',
        subtle: '#5D5D5D',
        accent: '#c5eb45'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
