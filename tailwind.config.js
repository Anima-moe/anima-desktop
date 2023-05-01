/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  variants: {},
  theme: {
    extend: {
      colors: {
        primary: '#0D0D0D',
        secondary: '#131313',
        tertiary: '#181818',
        subtle: '#5D5D5D',
        accent: '#27FF7E',
      },
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      animation: {
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
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
