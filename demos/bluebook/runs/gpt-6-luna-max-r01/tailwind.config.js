/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#fe2c55',
        canvas: '#f5f5f5',
        ink: '#26242a',
        muted: '#929099',
      },
      boxShadow: {
        card: '0 5px 18px rgba(36, 27, 34, .055)',
        lifted: '0 14px 34px rgba(36, 27, 34, .13)',
      },
    },
  },
  plugins: [],
};
