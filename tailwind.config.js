/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  variants: {},
  theme: {
    extend: {
      colors: {
        primary: '#040404',
        secondary: '#0D0D0D',
        tertiary: '#141414',
        subtle: '#5D5D5D',
        accent: '#27FF7E',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar'),
    require('vidstack/tailwind.cjs')({
      mediaPrefix: 'media', // paused:... -> media-paused:...
      sliderPrefix: 'slider', // dragging:... -> slider-dragging:...
    }),
  ],
}
