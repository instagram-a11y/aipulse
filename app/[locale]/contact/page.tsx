import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { FadeUp } from '@/components/FadeUp'
import { ContactForm } from '@/components/ContactForm'

const CONTACT_EMAIL = 'hello@aipulse.ca'

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('contact')

  return (
    <section className="bg-cream pt-36 pb-28 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="mb-16">
          <p className="section-label mb-4">{t('label')}</p>
          <h1 className="font-display font-light text-navy text-4xl sm:text-6xl mb-4">{t('heading')}</h1>
          <p className="text-sm text-silver max-w-md">{t('sub')}</p>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <FadeUp>
            <h2 className="font-display text-2xl text-navy mb-8">{t('info_heading')}</h2>
            <dl className="space-y-8">
              <div>
                <dt className="text-xs tracking-widest uppercase text-gold mb-2">{t('email_label')}</dt>
                <dd>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-ink hover:text-gold transition-colors">
                    {CONTACT_EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-widest uppercase text-gold mb-2">{t('location_label')}</dt>
                <dd className="text-ink">{t('location_value')}</dd>
              </div>
              <div className="gold-rule w-12" />
              <p className="text-sm text-silver">{t('response')}</p>
            </dl>
          </FadeUp>

          {/* Form */}
          <FadeUp delay={0.15}>
            <ContactForm />
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
