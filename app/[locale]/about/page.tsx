import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { FadeUp } from '@/components/FadeUp'
import { PhotoPlaceholder } from '@/components/PhotoPlaceholder'
import { SectionBg } from '@/components/SectionBg'

const valueKeys = ['precision', 'custom', 'partnership', 'longterm'] as const
const factKeys = ['founded', 'hq', 'expertise'] as const

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('about')

  return (
    <>
      {/* Section 1 — Hero over image */}
      <section className="relative h-[70vh] min-h-[480px] flex items-center justify-center text-center overflow-hidden">
        <SectionBg src="/images/bg/hero-constellation.webp" overlay="bg-navy/65" />
        <div className="relative z-10 px-6">
          <FadeUp>
            <p className="section-label mb-6">{t('label')}</p>
            <h1 className="font-display font-light text-white text-4xl sm:text-6xl max-w-3xl mx-auto leading-tight">
              {t('hero_title')}
            </h1>
          </FadeUp>
        </div>
      </section>

      {/* Section 2 — Story */}
      <section className="bg-cream py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <FadeUp>
            <p className="section-label mb-4">{t('story_label')}</p>
            <h2 className="font-display font-light text-navy text-3xl sm:text-4xl mb-8">
              {t('story_heading')}
            </h2>
            <div className="space-y-5 text-sm text-ink/70 leading-loose">
              <p>{t('story_p1')}</p>
              <p>{t('story_p2')}</p>
              <p>{t('story_p3')}</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="relative overflow-hidden">
              <PhotoPlaceholder label="Portrait — Coming Soon" aspectRatio="aspect-[3/4]" />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Section 3 — Values */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-16">
            <p className="section-label">{t('values_label')}</p>
          </FadeUp>
          <div className="grid sm:grid-cols-2 gap-6">
            {valueKeys.map((key, i) => (
              <FadeUp key={key} delay={i * 0.1}>
                <div className="bg-cream border-t-2 border-gold p-8 h-full">
                  <h3 className="font-display text-2xl text-navy mb-3">{t(`values.${key}.title`)}</h3>
                  <p className="text-sm text-silver leading-relaxed">{t(`values.${key}.body`)}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Facts */}
      <section className="bg-navy py-20 px-6">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-12 text-center">
          {factKeys.map((key, i) => (
            <FadeUp key={key} delay={i * 0.1}>
              <div className="font-display text-4xl sm:text-5xl text-gold mb-3">
                {t(`facts.${key}.value`)}
              </div>
              <div className="gold-rule w-8 mx-auto mb-4" />
              <p className="text-xs tracking-widest uppercase text-silver">{t(`facts.${key}.label`)}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Section 5 — CTA */}
      <section className="bg-cream py-28 px-6 text-center">
        <FadeUp>
          <h2 className="font-display font-light text-navy text-3xl sm:text-5xl mb-10 max-w-2xl mx-auto">
            {t('cta_heading')}
          </h2>
          <Link
            href="/book"
            className="inline-flex border border-gold text-navy text-xs tracking-widest uppercase
                       px-10 py-5 hover:bg-gold hover:text-navy transition-all duration-300"
          >
            {t('cta_button')}
          </Link>
        </FadeUp>
      </section>
    </>
  )
}
