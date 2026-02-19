/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './context/**/*.{js,jsx,ts,tsx,mdx}',
    './lib/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    screens: {
      xxs: '320px',
      xs: '460px',
      sm: '640px',
      md: '900px',
      lg: '1024px',
      xl: '1290px',
      '2xl': '1536px',
    },
    fontSize: {
      sm: [
        '0.875rem',
        {
          lineHeight: '1.25rem',
        },
      ],
      base: [
        '1rem',
        {
          lineHeight: '1.5rem',
        },
      ],
      lg: [
        '1.125rem',
        {
          lineHeight: '1.75rem',
        },
      ],
      xl: [
        '1.25rem',
        {
          lineHeight: '1.75rem',
        },
      ],
      '2xl': [
        '1.5rem',
        {
          lineHeight: '2rem',
        },
      ],
      '3xl': [
        '1.875rem',
        {
          lineHeight: '2.25rem',
        },
      ],
      '4xl': [
        '2.25rem',
        {
          lineHeight: '2.5rem',
        },
      ],
      '5xl': [
        '3rem',
        {
          lineHeight: '1',
        },
      ],
      '6xl': [
        '3.75rem',
        {
          lineHeight: '1',
        },
      ],
      '7xl': [
        '4.5rem',
        {
          lineHeight: '1',
        },
      ],
      '1.7lr': [
        '1.7rem',
        {
          lineHeight: '1',
        },
      ],
      xs: '0.9rem',
      '2xs': '0.8rem',
      '3xs': '0.5rem',
      '2.5xs': '0.6rem',
      '2.75xs': '0.7rem',
      '2lr': '2.5rem',
      '1.5lr': '1.2rem',
      lr: '1.1rem',
      '1.9lr': '1.9rem',
    },
    extend: {
      borderRadius: {
        large: '80px',
      },
      colors: {
        main: '#F40076',
        light: '#F7ECF1',
        white: '#FFFFFF',
        blurpink: '#840844',
        grey: 'rgb(87, 87, 87)',
      },
      animation: {
        carousel: 'carousel 10s infinite linear',
      },
      keyframes: ({ theme }) => ({
        carousel: {
          to: {
            transform: `translateX(calc(${168 * -2}px - (${theme('spacing.4')}*4)))`,
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('tailwind-scrollbar-hide'),
  ],
};
