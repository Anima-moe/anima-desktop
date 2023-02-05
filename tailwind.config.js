/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
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
        primary: '#161616',
        secondary: '#212121',
        tertiary: '#2E2E2E',
        subtle: '#5D5D5D',
        accent: '#c5eb45'
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
    require('vidstack/tailwind.cjs')
  ],
}
