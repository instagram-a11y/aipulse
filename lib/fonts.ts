import { Cormorant_Garamond, Inter } from 'next/font/google'
import localFont from 'next/font/local'

export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

// Sahel — a free (OFL) Persian typeface, self-hosted. Used for all Farsi content.
export const farsi = localFont({
  src: [
    { path: '../fonts/sahel/Sahel.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/sahel/Sahel-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-farsi',
  display: 'swap',
})
