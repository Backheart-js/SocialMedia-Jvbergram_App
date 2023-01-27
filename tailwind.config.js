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
        'blue-primary': '#0095f6',
        'blue-bold': '#118ab2',
      },
    },
  },
  plugins: [],
}