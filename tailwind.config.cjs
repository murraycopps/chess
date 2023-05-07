/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#8b4513',
        'light': '#ffebcd'
      },
      width: {
        '128': '32rem',
      },
      height: {
        '128': '32rem'
      }
    },
  },
  plugins: [],
}

