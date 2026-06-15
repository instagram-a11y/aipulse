'use client'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'

interface Props {
  images: string[]
  interval?: number
}

export function SlideshowBackground({ images, interval = 6000 }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const t = setInterval(() => setIndex((p) => (p + 1) % images.length), interval)
    return () => clearInterval(t)
  }, [images.length, interval])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{
            opacity: 1,
            scale: 1.18,
            transition: {
              opacity: { duration: 1.8, ease: 'easeInOut' },
              scale: { duration: interval / 1000 + 2, ease: 'linear' },
            },
          }}
          exit={{ opacity: 0, transition: { duration: 1.8, ease: 'easeInOut' } }}
        >
          <Image
            src={images[index]}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? 'w-8 bg-gold' : 'w-3 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
