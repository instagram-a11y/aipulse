import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1622',
          mid: '#111F2E',
          soft: '#1A2E42',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8D08A',
          pale: '#F5EDD0',
        },
        cream: '#F8F7F3',
        silver: '#A8B4C0',
        ink: '#1A2535',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Arial', 'sans-serif'],
        farsi: ['var(--font-farsi)', 'Tahoma', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.3em',
        widest3: '0.4em',
      },
    },
  },
  plugins: [],
}
export default config
