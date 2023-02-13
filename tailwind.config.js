/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'main-bg': '#fafafa',
        'dark-bg': '#121212',
        'blue-primary': '#0095f6',
        'blue-bold': '#118ab2',
        'highlight-dropdown': '#ED4956'
      },
    },
  },
  plugins: [
    require('postcss-import'),
    require('postcss-nesting'),
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}