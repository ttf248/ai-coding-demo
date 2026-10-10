/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#fe2c55', dark: '#e3204a', soft: '#fff0f3' },
        page: '#f5f5f5',
      },
      borderRadius: { card: '8px' },
      boxShadow: {
        card: '0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 6px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 24px rgba(0, 0, 0, 0.10), 0 2px 6px rgba(0, 0, 0, 0.06)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'none' } },
        'heart-pop': { '0%': { transform: 'scale(1)' }, '35%': { transform: 'scale(1.5)' }, '65%': { transform: 'scale(0.85)' }, '100%': { transform: 'scale(1)' } },
        shimmer: { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        'dot-bounce': { '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' }, '40%': { transform: 'scale(1)', opacity: '1' } },
        'sheet-up': { from: { transform: 'translateY(24px)', opacity: '0' }, to: { transform: 'none', opacity: '1' } },
      },
      animation: {
        'fade-in': 'fade-in .35s ease-out backwards',
        'heart-pop': 'heart-pop .45s cubic-bezier(.17,.89,.32,1.28)',
        shimmer: 'shimmer 1.4s linear infinite',
        'dot-bounce': 'dot-bounce 1.2s ease-in-out infinite',
        'sheet-up': 'sheet-up .28s ease-out both',
      },
    },
  },
  plugins: [],
};
