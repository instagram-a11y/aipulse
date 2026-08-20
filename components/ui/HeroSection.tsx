'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'

import { InteractiveWorkflowDemo } from './InteractiveWorkflowDemo'
import { GoldServiceTicker } from './GoldServiceTicker'
import { useTranslations } from 'next-intl'

export function HeroSection({ isRtl }: { isRtl: boolean }) {
  const t = useTranslations('hero')
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Mouse 3D Depth
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const { clientX, clientY } = e
    const { width, height, left, top } = containerRef.current.getBoundingClientRect()
    const x = (clientX - left) / width - 0.5
    const y = (clientY - top) / height - 0.5

    containerRef.current.style.setProperty('--mouse-x', `${x * 20}deg`)
    containerRef.current.style.setProperty('--mouse-y', `${-y * 20}deg`)
  }

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col bg-deep-navy text-white overflow-hidden perspective-[1000px]"
    >
      {/* Background layer */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 bg-deep-navy">

         {/* Grid Pattern Background */}
         <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
         <div className="absolute inset-0 bg-white/[0.02] bg-[url('/images/noise.png')] bg-repeat opacity-20 mix-blend-overlay" />
      </motion.div>

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center pt-32 pb-16 px-6 lg:px-16 max-w-[1600px] mx-auto w-full">
        
        {/* Left Copy */}
        <motion.div 
          className="w-full lg:w-[50%] flex flex-col justify-center transform-style-3d transition-transform duration-200 ease-out"
          style={{ transform: 'rotateY(var(--mouse-x, 0deg)) rotateX(var(--mouse-y, 0deg))' }}
        >

          
          <h1 className="text-4xl lg:text-6xl font-light font-display leading-[1.15] mb-6">
            {t('line1')} <br/>
            <span className="text-gold font-medium">{t('line2')}</span>
          </h1>
          
          <p className="text-slate text-lg lg:text-xl max-w-xl font-light leading-relaxed mb-10 border-l-2 border-gold/50 pl-6">
            {t('line3')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link
              href="/book"
              className="group relative overflow-hidden flex items-center justify-center gap-3 bg-gold text-deep-navy px-8 py-4 w-full sm:w-auto font-medium tracking-wide transition-all duration-300"
            >
              <span className="relative z-10">{t('cta_primary')}</span>
              <ArrowRight className={`relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              <div className="absolute inset-0 bg-white transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
            </Link>
          </div>
        </motion.div>

        {/* Right Demo */}
        <div className="w-full lg:w-[50%] mt-16 lg:mt-0 flex justify-center lg:justify-end">
           <InteractiveWorkflowDemo />
        </div>
      </div>

      {/* Gold Ticker */}
      <div className="relative z-20 mt-auto">
        <GoldServiceTicker />
      </div>
    </section>
  )
}
