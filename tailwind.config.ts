import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#071A2E',
        'deep-navy': '#FFFFFF',
        'ink-navy': '#F8F9FA',
        gold: '#C6A15B',
        mist: '#F3F6F8',
        slate: '#607080',
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
