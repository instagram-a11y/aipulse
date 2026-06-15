import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Mail } from 'lucide-react'
import { PulseCrest } from './PulseCrest'

const CONTACT_EMAIL = 'hello@aipulse.ca'

export function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const links = [
    { href: '/', label: nav('home') },
    { href: '/about', label: nav('about') },
    { href: '/services', label: nav('services') },
    { href: '/book', label: nav('book') },
    { href: '/contact', label: nav('contact') },
  ] as const

  return (
    <footer className="bg-navy border-t border-gold/20">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Brand block */}
        <div className="flex flex-col items-center text-center gap-6 mb-16">
          <PulseCrest size={48} animate={false} />
          <span className="wordmark font-display text-3xl font-light text-white">
            AI<span className="text-gold">Pulse</span>
          </span>
          <p className="font-display italic font-light text-white/50 text-lg max-w-sm">
            &ldquo;{t('tagline')}&rdquo;
          </p>
          <p className="text-gold/60 text-xs tracking-widest">aipulse.ca</p>
        </div>

        {/* Nav links */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-silver hover:text-gold text-xs tracking-widest uppercase transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Contact + social row */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-12">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-2 text-silver hover:text-gold text-xs tracking-wide transition-colors"
            aria-label="Email AIPulse"
          >
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
            {CONTACT_EMAIL}
          </a>
          <span className="text-silver/20 text-xs" aria-hidden="true">|</span>
          <a
            href="https://linkedin.com/company/aipulse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-silver hover:text-gold text-xs tracking-widest uppercase transition-colors"
            aria-label="AIPulse on LinkedIn"
          >
            LinkedIn
          </a>
        </div>

        <div className="h-px bg-gold/10 mb-8" />
        <p className="text-white/20 text-xs text-center tracking-wide">{t('copy')}</p>
      </div>
    </footer>
  )
}
