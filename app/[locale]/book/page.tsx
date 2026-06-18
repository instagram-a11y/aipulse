import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { PulseCrest } from '@/components/PulseCrest'
import { FadeUp } from '@/components/FadeUp'
import { CalEmbed } from '@/components/CalEmbed'

export default function BookPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('book')

  return (
    <>
      {/* Hero */}
      <section className="bg-navy pt-36 pb-20 px-6 text-center">
        <FadeUp className="flex justify-center mb-6">
          <PulseCrest size={60} animate={false} />
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="section-label mb-4">{t('label')}</p>
          <h1 className="font-display font-light text-white text-4xl sm:text-6xl mb-4">{t('heading')}</h1>
          <p className="text-sm text-silver max-w-md mx-auto">{t('sub')}</p>
        </FadeUp>
      </section>

      {/* Cal.com embed */}
      <section className="bg-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="bg-white border border-gold/20 min-h-[600px]">
              <CalEmbed />
            </div>
          </FadeUp>

          {/* What to expect */}
          <FadeUp delay={0.15} className="mt-16">
            <h2 className="font-display text-2xl text-navy mb-8 text-center">{t('expect_heading')}</h2>
            <ul className="space-y-4 max-w-lg mx-auto">
              {(['expect1', 'expect2', 'expect3'] as const).map((key) => (
                <li key={key} className="flex gap-3 text-sm text-ink/70">
                  <span className="text-gold">—</span>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
