import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { PulseCrest } from '@/components/PulseCrest'
import { FadeUp } from '@/components/FadeUp'
import { CalEmbed } from '@/components/CalEmbed'

export default function BookPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('book')

  return (
    <main className="min-h-screen bg-deep-navy text-white font-sans relative overflow-x-hidden">
      {/* Global Luxury Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <img src="/images/luxury_abstract_bg.jpg" alt="Luxury Background" className="w-full h-full object-cover" />
      </div>
      {/* Hero */}
      <section className="relative z-10 pt-36 pb-20 px-6 text-center">
        <FadeUp className="flex justify-center mb-6">
          <PulseCrest size={60} animate={false} />
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="text-gold tracking-widest text-sm uppercase mb-6">{t('label')}</p>
          <h1 className="font-display font-light text-white text-4xl sm:text-6xl mb-4 drop-shadow-2xl">{t('heading')}</h1>
          <p className="text-sm text-slate-300 max-w-md mx-auto">{t('sub')}</p>
        </FadeUp>
      </section>

      {/* Cal.com embed */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl min-h-[600px] overflow-hidden shadow-2xl p-4">
              <CalEmbed />
            </div>
          </FadeUp>

          {/* What to expect */}
          <FadeUp delay={0.15} className="mt-16 bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-3xl">
            <h2 className="font-display text-2xl text-white mb-8 text-center">{t('expect_heading')}</h2>
            <ul className="space-y-4 max-w-lg mx-auto">
              {(['expect1', 'expect2', 'expect3'] as const).map((key) => (
                <li key={key} className="flex gap-3 text-sm text-slate-200">
                  <span className="text-gold">—</span>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>
    </main>
  )
}
