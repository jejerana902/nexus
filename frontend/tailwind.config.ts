/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          start: '#0a0a1a',
          end: '#1a0a2e',
        },
        card: {
          DEFAULT: 'rgba(26, 26, 46, 0.6)',
          hover: 'rgba(26, 26, 46, 0.8)',
        },
        primary: '#8b5cf6',
        success: '#00ff88',
        danger: '#ff4444',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
