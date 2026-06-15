'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { PulseCrest } from './PulseCrest'
import { Wordmark } from './Wordmark'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const locale = useLocale()
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/services', label: t('services') },
    { href: '/book', label: t('book') },
    { href: '/contact', label: t('contact') },
  ] as const

  const toggleLocale = () => {
    router.replace(pathname, { locale: locale === 'en' ? 'fa' : 'en' })
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <PulseCrest size={36} animate={false} />
          <Wordmark onDark size="sm" />
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors text-sm tracking-wide relative
                             after:absolute after:bottom-0 after:left-0 after:h-px after:bg-gold after:transition-all
                             ${isActive
                               ? 'text-gold after:w-full'
                               : 'text-silver hover:text-gold after:w-0 hover:after:w-full'
                             }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Sign in */}
          <Link
            href="/login"
            className="hidden sm:inline text-xs tracking-widest text-silver hover:text-gold transition-colors"
          >
            {t('login')}
          </Link>

          {/* Language toggle */}
          <button
            onClick={toggleLocale}
            className="text-xs tracking-widest text-silver hover:text-gold transition-colors border
                       border-silver/30 hover:border-gold/50 px-3 py-1.5 rounded-none"
          >
            {locale === 'en' ? 'فا' : 'EN'}
          </button>

          {/* CTA */}
          <Link
            href="/book"
            className="hidden lg:inline-flex items-center gap-2 border border-gold text-white
                       text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-gold hover:text-navy
                       transition-all duration-300"
          >
            {t('cta')}
          </Link>

          {/* Hamburger */}
          <button
            className="lg:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className="block w-6 h-px bg-current mb-1.5 transition-all" />
            <span className="block w-4 h-px bg-current mb-1.5 transition-all" />
            <span className="block w-6 h-px bg-current transition-all" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-navy border-t border-navy-soft px-6 py-8 flex flex-col gap-6"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-display font-light transition-colors ${
                  isActive ? 'text-gold' : 'text-silver hover:text-gold'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/login"
            className="text-silver hover:text-gold text-lg font-display font-light"
            onClick={() => setMenuOpen(false)}
          >
            {t('login')}
          </Link>
          <Link
            href="/book"
            className="border border-gold text-white text-xs tracking-widest uppercase
                       px-5 py-3 text-center hover:bg-gold hover:text-navy transition-all mt-4"
            onClick={() => setMenuOpen(false)}
          >
            {t('cta')}
          </Link>
        </motion.div>
      )}
    </motion.header>
  )
}
