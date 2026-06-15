import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { cormorant, inter, farsi } from '@/lib/fonts'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import '../globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  metadataBase: new URL('https://aipulse.ca'),
  title: {
    default: 'AIPulse — AI Consulting & Automation | Canada',
    template: '%s | AIPulse',
  },
  description:
    'Custom AI agents, automation, and intelligent applications built precisely for your business. Based in Canada. Your vision, our intelligence, one pulse.',
  openGraph: {
    title: 'AIPulse',
    description: 'Your vision, our intelligence, one pulse.',
    url: 'https://aipulse.ca',
    siteName: 'AIPulse',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }
  setRequestLocale(locale)
  const messages = await getMessages()
  const dir = locale === 'fa' ? 'rtl' : 'ltr'

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cormorant.variable} ${inter.variable} ${farsi.variable}`}
    >
      <body className="bg-cream text-ink antialiased font-sans">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
