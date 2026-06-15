import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Bot, Workflow, Globe, Cloud, Target, Code2, type LucideIcon } from 'lucide-react'
import { FadeUp } from '@/components/FadeUp'

const serviceKeys = ['agents', 'automation', 'webapps', 'cloud', 'strategy', 'custom'] as const
const serviceIcons: Record<(typeof serviceKeys)[number], LucideIcon> = {
  agents: Bot,
  automation: Workflow,
  webapps: Globe,
  cloud: Cloud,
  strategy: Target,
  custom: Code2,
}
const processKeys = ['discovery', 'design', 'build', 'deploy'] as const

export default function ServicesPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('services')
  const tc = useTranslations('homeCta')

  return (
    <>
      {/* Hero */}
      <section className="bg-navy pt-36 pb-24 px-6 text-center">
        <FadeUp>
          <p className="section-label mb-6">{t('label')}</p>
          <h1 className="font-display font-light text-white text-5xl sm:text-7xl">{t('heading')}</h1>
        </FadeUp>
      </section>

      {/* Service detail sections */}
      <section className="bg-cream">
        {serviceKeys.map((key, i) => {
          const Icon = serviceIcons[key]
          return (
            <div key={key} className={i % 2 === 0 ? 'bg-cream' : 'bg-white'}>
              <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
                <FadeUp className={i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}>
                  <Icon className="text-gold w-12 h-12 mb-6" aria-hidden="true" />
                  <h2 className="font-display font-light text-navy text-3xl sm:text-4xl mb-5">
                    {t(`items.${key}.title`)}
                  </h2>
                  <p className="text-base text-ink/70 leading-loose max-w-md">{t(`items.${key}.body`)}</p>
                </FadeUp>

                {/* Visual panel — icon at scale with decorative number */}
                <FadeUp
                  delay={0.15}
                  className={i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}
                >
                  <div className="bg-navy-mid aspect-[4/3] flex flex-col items-center justify-center gap-6
                                  border border-gold/10 overflow-hidden relative">
                    {/* Subtle radial glow */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background:
                          'radial-gradient(circle at center, rgba(201,168,76,0.35) 0%, transparent 65%)',
                      }}
                      aria-hidden="true"
                    />
                    <Icon className="relative text-gold/50 w-20 h-20" aria-hidden="true" />
                    <div className="gold-rule w-10 relative" />
                    <span className="relative font-display text-6xl text-gold/15 select-none">
                      0{i + 1}
                    </span>
                  </div>
                </FadeUp>
              </div>
            </div>
          )
        })}
      </section>

      {/* Process */}
      <section className="bg-cream py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-16">
            <p className="section-label mb-4">{t('label')}</p>
            <h2 className="font-display font-light text-navy text-4xl sm:text-5xl">
              {t('process_heading')}
            </h2>
          </FadeUp>
          <div className="grid md:grid-cols-4 gap-8">
            {processKeys.map((key, i) => (
              <FadeUp key={key} delay={i * 0.15}>
                <div>
                  <div className="font-display text-4xl text-gold mb-4">0{i + 1}</div>
                  <div className="gold-rule w-8 mb-5" />
                  <h3 className="font-display text-xl text-navy mb-3">{t(`process.${key}.title`)}</h3>
                  <p className="text-sm text-silver leading-relaxed">{t(`process.${key}.body`)}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing note */}
      <section className="bg-navy-mid py-20 px-6 text-center">
        <FadeUp>
          <p className="font-display italic font-light text-white text-2xl sm:text-3xl max-w-3xl mx-auto">
            {t('pricing_note')}
          </p>
        </FadeUp>
      </section>

      {/* CTA */}
      <section className="bg-navy py-28 px-6 text-center">
        <FadeUp>
          <h2 className="font-display font-light text-white text-3xl sm:text-5xl mb-10 max-w-3xl mx-auto">
            {tc('heading')}
          </h2>
          <Link
            href="/book"
            className="inline-flex bg-gold text-navy text-xs tracking-widest uppercase px-10 py-5
                       hover:bg-gold-light transition-all duration-300"
          >
            {tc('button')}
          </Link>
        </FadeUp>
      </section>
    </>
  )
}
