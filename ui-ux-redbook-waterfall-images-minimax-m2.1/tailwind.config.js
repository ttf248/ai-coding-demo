/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'redbook': '#fe2c55',
        'redbook-light': '#ff6b81',
      }
    },
  },
  plugins: [],
}
