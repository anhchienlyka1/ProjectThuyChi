/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'kid-primary': '#FF6B6B',
        'kid-secondary': '#4ECDC4',
        'kid-accent': '#FFE66D',
        'kid-text': '#2D3436',
        'kid-surface': '#F7FFF7'
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        round: ['Nunito', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
