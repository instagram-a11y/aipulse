'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'next-intl'
import { contactSchema, type ContactInput } from '@/lib/validations'

export function ContactForm() {
  const t = useTranslations('contact.form')
  const locale = useLocale()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { language: locale === 'fa' ? 'fa' : 'en' },
  })

  const onSubmit = async (data: ContactInput) => {
    setStatus('idle')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  const field =
    'bg-transparent border-b border-silver/30 focus:border-gold text-ink pb-3 outline-none w-full transition-colors'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <input className={field} placeholder={t('name')} {...register('name')} />
        {errors.name && <p className="text-red-600 text-xs mt-2">{errors.name.message}</p>}
      </div>
      <div>
        <input className={field} placeholder={t('email')} {...register('email')} />
        {errors.email && <p className="text-red-600 text-xs mt-2">{errors.email.message}</p>}
      </div>
      <div>
        <input className={field} placeholder={t('company')} {...register('company')} />
      </div>
      <div>
        <textarea className={`${field} resize-none`} rows={4} placeholder={t('message')} {...register('message')} />
        {errors.message && <p className="text-red-600 text-xs mt-2">{errors.message.message}</p>}
      </div>

      <fieldset className="flex items-center gap-6">
        <legend className="text-xs tracking-widest uppercase text-silver mb-3">{t('language')}</legend>
        <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
          <input type="radio" value="en" {...register('language')} className="accent-gold" />
          {t('lang_en')}
        </label>
        <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
          <input type="radio" value="fa" {...register('language')} className="accent-gold" />
          {t('lang_fa')}
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full border border-gold text-navy text-xs tracking-widest uppercase py-4
                   hover:bg-gold hover:text-navy transition-all duration-300 disabled:opacity-50"
      >
        {isSubmitting ? t('sending') : t('submit')}
      </button>

      {status === 'success' && <p className="text-gold text-sm text-center">{t('success')}</p>}
      {status === 'error' && <p className="text-red-600 text-sm text-center">{t('error')}</p>}
    </form>
  )
}
