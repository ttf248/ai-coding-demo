/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#fe2c55',
        page: '#f5f5f5',
      },
    },
  },
  plugins: [],
}
