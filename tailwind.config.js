/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  variants: {
    extend: {
      'nth-last-child': '&:not(:last-child)',
      'nth-first-child': '&:not(:first-child)',
      'nth-last-of-type': '&:not(:last-of-type)',
    }
  },
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#0D0D0D',
        tertiary: '#141414',
        subtle: '#5D5D5D',
        accent: '#27FF7E',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
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
