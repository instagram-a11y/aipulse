'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Props {
  src: string
  /** Tailwind classes for the overlay (controls darkness for text readability) */
  overlay?: string
  /** alignment of the image within the frame */
  position?: string
}

/**
 * A decorative section background: an on-brand generated artwork with a soft
 * zoom-in on scroll (no continuous parallax — safe on mobile) and a navy
 * overlay so foreground text stays readable.
 */
export function SectionBg({ src, overlay = 'bg-navy/80', position = 'object-center' }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.14, opacity: 0.5 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-8%' }}
        transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Image src={src} alt="" fill sizes="100vw" className={`object-cover ${position}`} />
      </motion.div>
      <div className={`absolute inset-0 ${overlay}`} />
    </div>
  )
}
