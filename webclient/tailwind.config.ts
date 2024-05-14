/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './theme.config.tsx',
    './node_modules/markprompt/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        ginie: ['Ginie'],
        sec:['secondary']
      },
      animation: {
        spin: 'spin calc(var(--speed) * 2) infinite linear',
        slide: 'slide var(--speed) ease-in-out infinite alternate',
      },
    },
    screens: {
      sm: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    keyframes: {
      spin: {
        '0%': {
          rotate: '0deg',
        },
        '15%, 35%': {
          rotate: '90deg',
        },
        '65%, 85%': {
          rotate: '270deg',
        },
        '100%': {
          rotate: '360deg',
        },
      },
      slide: {
        to: {
          transform: 'translate(calc(100cqw - 100%), 0)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
  darkMode: 'class',
};