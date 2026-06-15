import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { PulseCrest } from '@/components/PulseCrest'
import { FadeUp } from '@/components/FadeUp'

export default function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('auth')

  return (
    <section className="bg-navy min-h-screen flex items-center justify-center px-6 py-32">
      <FadeUp className="w-full max-w-sm text-center">
        <div className="flex justify-center mb-8">
          <PulseCrest size={56} animate={false} />
        </div>
        <h1 className="font-display font-light text-white text-3xl mb-3">{t('login_heading')}</h1>
        <div className="gold-rule w-10 mx-auto mb-8" />
        <div className="bg-navy-mid border border-gold/20 p-8">
          <p className="text-sm text-silver leading-relaxed">
            {locale === 'fa'
              ? 'ورود و ثبت‌نام کاربران به‌زودی فعال می‌شود.'
              : 'User sign-in and registration are coming online shortly.'}
          </p>
        </div>
      </FadeUp>
    </section>
  )
}
