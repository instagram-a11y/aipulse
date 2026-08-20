'use client'

import { motion } from 'framer-motion'

const services = [
  "AI Agents",
  "Automation",
  "CRM Systems",
  "Dynamic Websites",
  "Intelligent Workflows",
  "Strategy & Consulting"
]

export function GoldServiceTicker() {
  return (
    <div className="w-full bg-gold/10 border-t border-b border-gold/20 py-3 overflow-hidden flex items-center">
      <motion.div
        className="flex whitespace-nowrap items-center gap-8"
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20
        }}
      >
        {/* We map twice to create a seamless loop effect */}
        {[...services, ...services, ...services].map((service, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="text-gold font-display uppercase tracking-widest text-xs font-semibold">
              {service}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
