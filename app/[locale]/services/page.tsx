import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Bot, Workflow, Globe, Cloud, Target, Code2, type LucideIcon, ArrowRight } from 'lucide-react'
import { FadeUp } from '@/components/FadeUp'
import Image from 'next/image'

const serviceKeys = ['strategy', 'agents', 'automation', 'cloud', 'webapps', 'custom'] as const
const serviceIcons: Record<(typeof serviceKeys)[number], LucideIcon> = {
  strategy: Target,
  agents: Bot,
  automation: Workflow,
  cloud: Cloud,
  webapps: Globe,
  custom: Code2,
}
const processKeys = ['discovery', 'design', 'build', 'deploy'] as const

export default function ServicesPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('services')
  const tc = useTranslations('homeCta')
  const isRtl = locale === 'fa'

  return (
    <main className="min-h-screen bg-deep-navy text-white font-sans relative overflow-x-hidden">
      {/* Global Luxury Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <Image src="/images/luxury_abstract_bg.jpg" alt="Luxury Background" fill className="object-cover" />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="pt-40 pb-24 px-6 text-center max-w-5xl mx-auto">
          <FadeUp>
            <p className="text-gold tracking-widest text-sm uppercase mb-6">{t('label')}</p>
            <h1 className="font-display font-light text-white text-5xl lg:text-7xl leading-tight drop-shadow-2xl">
              {t('heading')}
            </h1>
          </FadeUp>
        </section>

        {/* Core Services (Glassmorphism Grid) */}
        <section className="py-20 px-6 lg:px-16 max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceKeys.map((key, i) => {
              const Icon = serviceIcons[key]
              return (
                <FadeUp key={key} delay={i * 0.1} className="h-full">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-gold/30 rounded-3xl p-10 h-full flex flex-col transition-all duration-500 hover:bg-white/10 group shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    <div className="w-16 h-16 rounded-2xl bg-ink-navy border border-white/5 flex items-center justify-center mb-8 shadow-inner group-hover:shadow-[0_0_20px_rgba(198,161,91,0.2)] transition-shadow">
                      <Icon className="text-gold w-8 h-8 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" aria-hidden="true" />
                    </div>
                    <h2 className="font-display font-light text-white text-3xl mb-4">
                      {t(`items.${key}.title`)}
                    </h2>
                    <p className="text-base text-slate-100 leading-relaxed font-light">
                      {t(`items.${key}.body`)}
                    </p>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </section>

        {/* The Process (Methodology) */}
        <section className="py-32 px-6 lg:px-16 max-w-7xl mx-auto">
          <FadeUp className="text-center mb-20">
            <h2 className="font-display font-light text-white text-4xl lg:text-5xl">
              {t('process_heading')}
            </h2>
            <div className="w-16 h-px bg-gold mx-auto mt-8" />
          </FadeUp>
          
          <div className="grid md:grid-cols-4 gap-8">
            {processKeys.map((key, i) => (
              <FadeUp key={key} delay={i * 0.15} className="relative">
                {/* Connector Line (Desktop only) */}
                {i !== 3 && (
                  <div className={`hidden md:block absolute top-10 ${isRtl ? '-left-1/2' : '-right-1/2'} w-full h-px bg-gradient-to-r from-gold/50 to-transparent`} />
                )}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-ink-navy border border-gold/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(198,161,91,0.1)]">
                    <span className="font-display text-3xl text-gold">0{i + 1}</span>
                  </div>
                  <h3 className="font-display text-2xl text-white mb-4">{t(`process.${key}.title`)}</h3>
                  <p className="text-sm text-slate-200 leading-relaxed font-light">{t(`process.${key}.body`)}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* Pricing Note */}
        <section className="py-16 px-6 text-center border-t border-white/5 bg-ink-navy/30">
          <FadeUp>
            <p className="font-display italic font-light text-gold text-2xl lg:text-3xl max-w-4xl mx-auto">
              &quot;{t('pricing_note')}&quot;
            </p>
          </FadeUp>
        </section>

        {/* Final CTA */}
        <section className="relative py-40 px-6 text-center overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 bg-gradient-to-t from-deep-navy to-transparent opacity-80" />
          <FadeUp className="relative z-10">
            <h2 className="font-display font-light text-white text-4xl sm:text-6xl mb-12 max-w-3xl mx-auto leading-tight">
              {tc('heading')}
            </h2>
            <Link
              href="/book"
              className="inline-flex items-center gap-3 bg-gold text-deep-navy px-12 py-6 text-sm font-semibold tracking-widest uppercase hover:bg-white transition-all duration-300 shadow-[0_0_40px_rgba(198,161,91,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
            >
              <span>{tc('button')}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </FadeUp>
        </section>
      </div>
    </main>
  )
}
