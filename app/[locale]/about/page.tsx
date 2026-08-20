'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { FadeUp } from '@/components/FadeUp'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const valueKeys = ['precision', 'custom', 'partnership', 'longterm'] as const
const factKeys = ['founded', 'hq', 'expertise'] as const

export default function AboutPage() {
  const t = useTranslations('about')
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Parallax effect for the image
  const y = useTransform(scrollYProgress, [0, 1], [-50, 50])

  return (
    <main className="min-h-screen bg-deep-navy text-white font-sans relative overflow-x-hidden" ref={containerRef}>
      {/* Global Luxury Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <Image src="/images/luxury_abstract_bg.jpg" alt="Luxury Background" fill className="object-cover" />
      </div>

      <div className="relative z-10">
        {/* Section 1 — Hero Motion Tour */}
        <section className="relative min-h-[80vh] flex items-center justify-center text-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen">
             <Image src="/images/abstract_3d.jpg" alt="Abstract Nodes" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-deep-navy/70 to-deep-navy z-0" />
          
          <div className="relative z-10 px-6 max-w-4xl mx-auto">
            <motion.p 
              className="text-gold tracking-widest text-sm uppercase mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {t('label')}
            </motion.p>
            
            <motion.h1 
              className="font-display font-light text-white text-5xl sm:text-7xl leading-tight drop-shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            >
              {t('hero_title')}
            </motion.h1>
            
            <motion.div 
              className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-12"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
          </div>
        </section>

        {/* Section 2 — Story with Parallax */}
        <section className="py-24 px-6 lg:px-16 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <p className="text-gold tracking-widest text-xs uppercase mb-4">{t('story_label')}</p>
              <h2 className="font-display font-light text-white text-4xl sm:text-5xl mb-8 leading-tight">
                {t('story_heading')}
              </h2>
              <div className="space-y-6 text-base text-slate-100 font-light leading-relaxed">
                <p>{t('story_p1')}</p>
                <p>{t('story_p2')}</p>
                <p className="text-gold italic border-l-2 border-gold pl-4">{t('story_p3')}</p>
              </div>
            </FadeUp>
            
            <FadeUp delay={0.2} className="relative h-full min-h-[500px] w-full perspective-[1000px]">
              <motion.div 
                style={{ y }}
                className="relative w-full h-[500px] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group"
              >
                {/* Fallback color if image is missing */}
                <div className="absolute inset-0 bg-ink-navy" />
                <Image 
                  src="/images/team-aipulse.webp" 
                  alt="AIPulse Story" 
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-white font-display tracking-widest text-sm uppercase">Global Vision</p>
                  </div>
                </div>
              </motion.div>
            </FadeUp>
          </div>
        </section>

        {/* Section 3 — Values (Glassmorphism Cards) */}
        <section className="py-24 px-6 lg:px-16 relative">
          <div className="absolute inset-0 bg-ink-navy/50 border-t border-b border-white/5" />
          <div className="max-w-7xl mx-auto relative z-10">
            <FadeUp className="text-center mb-16">
              <h2 className="font-display font-light text-white text-3xl sm:text-5xl mb-6">
                {t('values_label')}
              </h2>
              <div className="w-12 h-1 bg-gold mx-auto rounded-full" />
            </FadeUp>
            
            <div className="grid md:grid-cols-2 gap-8">
              {valueKeys.map((key, i) => (
                <FadeUp key={key} delay={i * 0.1}>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-gold/30 p-10 h-full rounded-3xl transition-all duration-500 group shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-2">
                    <div className="text-gold font-display text-4xl mb-4 opacity-30 group-hover:opacity-100 transition-opacity">
                      0{i + 1}
                    </div>
                    <h3 className="font-display text-2xl text-white mb-4 group-hover:text-gold transition-colors">{t(`values.${key}.title`)}</h3>
                    <p className="text-sm text-slate-200 leading-relaxed font-light">{t(`values.${key}.body`)}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4 — Facts (Animated Stats) */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-16 text-center">
            {factKeys.map((key, i) => (
              <FadeUp key={key} delay={i * 0.1} className="relative group">
                <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <motion.div 
                  className="font-display text-5xl sm:text-7xl text-gold mb-6 font-light drop-shadow-[0_0_15px_rgba(198,161,91,0.4)]"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  {t(`facts.${key}.value`)}
                </motion.div>
                <div className="w-12 h-px bg-gold/50 mx-auto mb-6" />
                <p className="text-sm tracking-widest uppercase text-slate-200 font-medium">
                  {t(`facts.${key}.label`)}
                </p>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* Section 5 — CTA */}
        <section className="relative py-40 px-6 text-center overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 bg-gradient-to-t from-deep-navy to-ink-navy/50 opacity-80" />
          <FadeUp className="relative z-10">
            <h2 className="font-display font-light text-white text-3xl sm:text-5xl mb-12 max-w-2xl mx-auto leading-tight">
              {t('cta_heading')}
            </h2>
            <Link
              href="/book"
              className="inline-flex items-center gap-3 bg-gold text-deep-navy px-12 py-6 text-sm font-semibold tracking-widest uppercase hover:bg-white transition-all duration-300 shadow-[0_0_40px_rgba(198,161,91,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
            >
              {t('cta_button')}
            </Link>
          </FadeUp>
        </section>
      </div>
    </main>
  )
}
