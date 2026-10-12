/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#fe2c55',
        page: '#f5f5f5',
      },
      screens: {
        // 移动端 2 列 / 平板 3 列 / 桌面 4 列
        tablet: '768px',
        desktop: '1100px',
      },
      keyframes: {
        heartPop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.6)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'heart-pop': 'heartPop 0.45s ease-out',
        'fade-in': 'fadeIn 0.35s ease-out both',
      },
    },
  },
  plugins: [],
}
