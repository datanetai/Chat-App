/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--primary)',
        'secondary': 'var(--secondary)',
        'accent': 'var(--accent)',
        'text': 'var(--text)',
        'text2': 'var(--text2)',
        'background': 'var(--background)',
      },
    },
  },
  plugins: [],
}