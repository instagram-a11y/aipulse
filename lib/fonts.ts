import { Cormorant_Garamond, Inter, Vazirmatn } from 'next/font/google'

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

// Vazirmatn - A beautiful modern Persian typeface
export const farsi = Vazirmatn({
  subsets: ['arabic'],
  weight: ['300', '400', '700'],
  variable: '--font-farsi',
  display: 'swap',
})
