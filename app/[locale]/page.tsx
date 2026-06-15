import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { Bot, Workflow, Globe, Cloud, Target, Code2, ChevronDown, type LucideIcon } from 'lucide-react'
import { PulseCrest } from '@/components/PulseCrest'
import { FadeUp } from '@/components/FadeUp'
import { SlideshowBackground } from '@/components/SlideshowBackground'
import { SectionBg } from '@/components/SectionBg'

const serviceKeys = ['agents', 'automation', 'webapps', 'cloud', 'strategy', 'custom'] as const
const serviceIcons: Record<(typeof serviceKeys)[number], LucideIcon> = {
  agents: Bot,
  automation: Workflow,
  webapps: Globe,
  cloud: Cloud,
  strategy: Target,
  custom: Code2,
}

const heroSlides = [
  '/images/bg/hero-constellation.webp',
  '/images/bg/hero-aurora.webp',
  '/images/bg/hero-pulse.webp',
]

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('hero')
  const ti = useTranslations('intro')
  const ts = useTranslations('services')
  const tw = useTranslations('why')
  const tf = useTranslations('team')
  const tc = useTranslations('homeCta')

  return (
    <>
      {/* Section A — Hero with slideshow */}
      <section className="relative min-h-screen bg-navy flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <SlideshowBackground images={heroSlides} interval={6500} />
        {/* readability overlays */}
        <div className="absolute inset-0 bg-navy/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-transparent to-navy" />

        <div className="relative z-10 flex flex-col items-center">
          <FadeUp className="mb-8">
            <PulseCrest size={96} animate />
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="section-label mb-8">{t('label')}</p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <h1 className="font-display font-light text-white leading-[1.05] text-5xl sm:text-7xl lg:text-8xl drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]">
              {t('line1')} <br className="hidden sm:block" />
              {t('line2')} <br className="hidden sm:block" />
              <span className="italic text-gold">{t('line3')}</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.35}>
            <div className="gold-rule w-14 mx-auto my-10" />
          </FadeUp>
          <FadeUp delay={0.45}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="border border-gold text-white text-xs tracking-widest uppercase px-8 py-4
                           hover:bg-gold hover:text-navy transition-all duration-300 backdrop-blur-sm"
              >
                {t('cta_primary')}
              </Link>
              <Link
                href="/services"
                className="border border-silver/30 text-silver text-xs tracking-widest uppercase px-8 py-4
                           hover:border-silver transition-all duration-300 backdrop-blur-sm"
              >
                {t('cta_secondary')}
              </Link>
            </div>
          </FadeUp>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="text-gold/60 w-6 h-6" aria-hidden="true" />
        </div>
      </section>

      {/* Section B — Intro strip over mesh */}
      <section className="relative bg-navy-mid py-24 px-6 text-center overflow-hidden">
        <SectionBg src="/images/bg/section-mesh.webp" overlay="bg-navy-mid/85" />
        <FadeUp className="relative z-10">
          <p className="font-display italic font-light text-white text-2xl sm:text-3xl lg:text-4xl max-w-3xl mx-auto">
            {ti('line')}
          </p>
          <div className="gold-rule w-10 mx-auto mt-8" />
        </FadeUp>
      </section>

      {/* Section C — Services grid (clean light section for contrast/readability) */}
      <section className="bg-cream py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-16">
            <p className="section-label mb-4">{ts('label')}</p>
            <h2 className="font-display font-light text-navy text-4xl sm:text-5xl">{ts('heading')}</h2>
          </FadeUp>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceKeys.map((key, i) => {
              const Icon = serviceIcons[key]
              return (
                <FadeUp key={key} delay={i * 0.08}>
                  <div className="group bg-white border-b-2 border-transparent hover:border-gold p-8 h-full
                                  transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                    <Icon className="text-gold w-6 h-6 mb-4" aria-hidden="true" />
                    <h3 className="font-display text-xl text-navy mb-3">{ts(`items.${key}.title`)}</h3>
                    <p className="text-sm text-silver leading-relaxed">{ts(`items.${key}.body`)}</p>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section D — Why AIPulse over radar rings */}
      <section className="relative bg-navy py-28 px-6 overflow-hidden">
        <SectionBg src="/images/bg/section-rings.webp" overlay="bg-navy/82" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <FadeUp className="text-center mb-16">
            <p className="section-label mb-4">{tw('label')}</p>
            <h2 className="font-display font-light text-white text-4xl sm:text-5xl">{tw('heading')}</h2>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-12">
            {(['custom', 'discovery', 'partnership'] as const).map((key, i) => (
              <FadeUp key={key} delay={i * 0.12}>
                <div>
                  <div className="font-display text-5xl text-gold opacity-25 mb-4">0{i + 1}</div>
                  <div className="gold-rule w-8 mb-6" />
                  <h3 className="font-display text-2xl text-white mb-4">{tw(`${key}.title`)}</h3>
                  <p className="text-sm text-silver leading-loose">{tw(`${key}.body`)}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Section E — The team (clean light section) */}
      <section className="bg-cream py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12 items-center">
          <FadeUp className="lg:col-span-3">
            <div className="relative aspect-[4/3] overflow-hidden bg-navy">
              <Image
                src="/images/team-aipulse.webp"
                alt="AIPulse — one team, one pulse"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          </FadeUp>
          <FadeUp delay={0.15} className="lg:col-span-2">
            <p className="section-label mb-4">{tf('label')}</p>
            <h3 className="font-display text-4xl text-navy mb-4 leading-tight">{tf('heading')}</h3>
            <p className="text-sm text-gold tracking-wide mb-6">{tf('title')}</p>
            <p className="text-sm text-ink/70 leading-loose mb-8">{tf('bio')}</p>
            <div className="gold-rule w-12 mb-8" />
            <Link
              href="/about"
              className="text-gold text-xs tracking-widest uppercase hover:text-gold-light transition-colors"
            >
              {tf('link')} →
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* Section F — CTA banner over aurora */}
      <section className="relative bg-navy py-32 px-6 text-center overflow-hidden">
        <SectionBg src="/images/bg/hero-aurora.webp" overlay="bg-navy/75" position="object-bottom" />
        <div
          className="absolute inset-0 opacity-50 z-[1]"
          style={{
            background:
              'radial-gradient(circle at center, rgba(201,168,76,0.18) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10">
          <FadeUp className="flex justify-center mb-8">
            <PulseCrest size={60} animate={false} />
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-display font-light text-white text-3xl sm:text-5xl max-w-3xl mx-auto mb-10">
              {tc('heading')}
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-gold text-navy text-xs tracking-widest uppercase
                         px-10 py-5 hover:bg-gold-light transition-all duration-300"
            >
              {tc('button')}
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
