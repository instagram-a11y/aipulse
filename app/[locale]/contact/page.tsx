import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { FadeUp } from '@/components/FadeUp'
import { ContactForm } from '@/components/ContactForm'

const CONTACT_EMAIL = 'hello@aipulse.ca'

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('contact')

  return (
    <main className="min-h-screen bg-deep-navy text-white font-sans relative overflow-x-hidden">
      {/* Global Luxury Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <img src="/images/luxury_abstract_bg.jpg" alt="Luxury Background" className="w-full h-full object-cover" />
      </div>
      <section className="relative z-10 pt-36 pb-28 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="mb-16">
            <p className="text-gold tracking-widest text-sm uppercase mb-6">{t('label')}</p>
            <h1 className="font-display font-light text-white text-4xl sm:text-6xl mb-4">{t('heading')}</h1>
            <p className="text-sm text-slate-300 max-w-md">{t('sub')}</p>
          </FadeUp>

        <div className="grid lg:grid-cols-2 gap-16 relative z-10">
          {/* Info */}
          <FadeUp>
            <h2 className="font-display text-2xl text-white mb-8">{t('info_heading')}</h2>
            <dl className="space-y-8">
              <div>
                <dt className="text-xs tracking-widest uppercase text-gold mb-2">{t('email_label')}</dt>
                <dd>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-slate-100 hover:text-gold transition-colors">
                    {CONTACT_EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-widest uppercase text-gold mb-2">{t('location_label')}</dt>
                <dd className="text-slate-100">{t('location_value')}</dd>
              </div>
              <div className="w-12 h-px bg-gold/50" />
              <p className="text-sm text-slate-300">{t('response')}</p>
            </dl>
          </FadeUp>

          {/* Form */}
          <FadeUp delay={0.15} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <ContactForm />
          </FadeUp>
        </div>
        </div>
      </section>
    </main>
  )
}
