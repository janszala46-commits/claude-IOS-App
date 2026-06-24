/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0D0D0F',
        card: '#1A1A1E',
        accent: '#6C63FF',
        border: 'rgba(255,255,255,0.08)',
        secondary: '#6B7280',
      },
      borderRadius: {
        DEFAULT: '12px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(108, 99, 255, 0.3)',
      },
    },
  },
  plugins: [],
}
