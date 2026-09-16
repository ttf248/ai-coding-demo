/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fe2c55',
        secondary: '#ff6b9d',
        background: '#f5f5f5',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'bounce-heart': 'bounceHeart 0.3s ease-in-out',
        'float-up': 'floatUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceHeart: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0) scale(1)', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' },
          '100%': { transform: 'translateY(-4px) scale(1.02)', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' },
        },
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
}
