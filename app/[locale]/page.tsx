import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { Bot, Workflow, Cloud, Target, Code2, Globe, ArrowRight } from 'lucide-react'
import { FadeUp } from '@/components/FadeUp'
import { HeroSection } from '@/components/ui/HeroSection'

const serviceKeys = ['strategy', 'agents', 'automation', 'cloud', 'webapps', 'custom'] as const
const serviceIcons: Record<(typeof serviceKeys)[number], React.ElementType> = {
  strategy: Target,
  agents: Bot,
  automation: Workflow,
  cloud: Cloud,
  webapps: Globe,
  custom: Code2,
}

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const tt = useTranslations('trust')
  const tp = useTranslations('problem')
  const ts = useTranslations('services')
  const ti = useTranslations('impact')
  const tf = useTranslations('team')
  const tc = useTranslations('homeCta')
  
  const isRtl = locale === 'fa'

  return (
    <main className="min-h-screen bg-deep-navy text-white overflow-x-hidden font-sans relative">
      {/* Global Luxury Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <Image src="/images/luxury_abstract_bg.jpg" alt="Luxury Background" fill className="object-cover" />
      </div>
      
      <div className="relative z-10">
        {/* 1. HERO SECTION (Bespoke AI Consultancy) */}
      <HeroSection isRtl={isRtl} />

      {/* 2. TRUST STRIP */}
      <section className="bg-ink-navy border-t border-b border-white/5 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-8 lg:gap-16 text-slate text-sm font-medium tracking-widest uppercase">
          {(tt.raw('steps') as string[]).map((step, i) => (
            <div key={step} className="flex items-center gap-8">
              <span className="hover:text-gold transition-colors cursor-default">{step}</span>
              {i !== 4 && <ArrowRight className={`w-4 h-4 text-white/20 ${isRtl ? 'rotate-180' : ''}`} />}
            </div>
          ))}
        </div>
      </section>

      {/* 3. PROBLEM RECOGNITION (Glassmorphism Cards) */}
      <section className="py-24 px-6 lg:px-16 max-w-7xl mx-auto relative z-10">
        <FadeUp className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl lg:text-5xl font-display font-light text-white leading-tight">
            {tp('heading')}
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-10" />
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            tp('items.support'),
            tp('items.leads'),
            tp('items.calendar'),
            tp('items.content'),
            tp('items.training'),
            tp('items.reports')
          ].map((problem, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gold/20 h-full hover:border-gold/50 transition-colors">
                <p className="text-slate-100 font-medium leading-relaxed">{problem}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* 4. SOLUTION CARDS */}
      <section className="bg-deep-navy text-white py-32 px-6 lg:px-16 relative">
        <div className="absolute inset-0 z-0 opacity-20">
           <Image src="/images/abstract_3d.jpg" alt="AI Nodes" fill className="object-cover mix-blend-screen" />
           <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-deep-navy/80 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeUp className="mb-20">
            <p className="text-gold tracking-widest text-sm uppercase mb-4">{ts('label')}</p>
            <h2 className="text-4xl lg:text-6xl font-display font-light max-w-2xl">{ts('heading')}</h2>
          </FadeUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {serviceKeys.map((key, i) => {
              const Icon = serviceIcons[key]
              return (
                <FadeUp key={key} delay={i * 0.1} className="bg-deep-navy p-10 group hover:bg-ink-navy transition-colors duration-500">
                  <Icon className="text-gold w-8 h-8 mb-8 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-2xl font-display mb-4">{ts(`items.${key}.title`)}</h3>
                  <p className="text-slate text-sm leading-relaxed">{ts(`items.${key}.body`)}</p>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4.5. PREMIUM CORPORATE IMPACT (Automation & Chatbots) */}
      <section className="relative py-32 lg:py-40 overflow-hidden bg-ink-navy">
        <div className="absolute inset-0 z-0 flex flex-col md:flex-row w-full">
           <div className="w-full md:w-1/2 relative h-1/2 md:h-full">
             <Image src="/images/automation.jpg" alt="Enterprise Automation" fill className="object-cover opacity-40 mix-blend-screen" />
           </div>
           <div className="w-full md:w-1/2 relative h-1/2 md:h-full">
             <Image src="/images/ai_chatbot.jpg" alt="AI Chatbots" fill className="object-cover opacity-40 mix-blend-screen" />
           </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-deep-navy/80 to-transparent z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 text-center">
           <FadeUp>
             <h2 className="text-4xl lg:text-6xl font-display font-light text-white mb-6 max-w-3xl mx-auto">
               {ti('heading_part1')} <br /> {ti('heading_part2')}
             </h2>
             <p className="text-xl text-slate max-w-2xl mx-auto leading-relaxed">
               {ti('body')}
             </p>
           </FadeUp>
        </div>
      </section>

      {/* 5. FOUNDER SECTION (Editorial) */}
      <section className="py-32 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 rounded-t-full overflow-hidden border border-gold/20 shadow-[0_0_40px_rgba(198,161,91,0.1)]">
              <Image 
                src="/images/team-aipulse.webp" 
                alt={tf('name')} 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
            </div>
          </FadeUp>
          <FadeUp delay={0.2} className="flex flex-col justify-center">
            <h2 className="text-4xl lg:text-6xl font-display font-light text-white mb-8 leading-tight">
              {tf('heading')}
            </h2>
            <blockquote className="text-xl lg:text-2xl font-display text-slate italic leading-relaxed mb-8 border-l-2 border-gold pl-6">
              {tf('bio')}
            </blockquote>
            <div>
              <p className="font-semibold text-gold tracking-wide uppercase">{tf('name')}</p>
              <p className="text-slate text-sm">{tf('title')}</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 6. FINAL CTA (Dynamic Footer) */}
      <section className="relative py-40 px-6 text-center overflow-hidden border-t border-white/5">
        <Image src="/images/dynamic_footer.jpg" alt="Future Horizon" fill className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-navy to-transparent opacity-80" />
        
        <FadeUp className="relative z-10">
          <h2 className="text-4xl lg:text-7xl font-display text-white max-w-4xl mx-auto mb-10 leading-tight drop-shadow-2xl">
            {tc('heading')}
          </h2>
          <Link
            href="/book"
            className="inline-flex items-center gap-3 bg-gold text-deep-navy px-12 py-6 text-sm font-semibold tracking-widest uppercase hover:bg-white transition-all duration-300 shadow-[0_0_40px_rgba(198,161,91,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
          >
            {tc('button')}
          </Link>
        </FadeUp>
      </section>
      </div>
    </main>
  )
}
