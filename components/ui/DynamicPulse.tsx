'use client'

import { motion } from 'framer-motion'

export function DynamicPulse() {
  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[400px]">
      {/* Outer Glow */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-gold/10 blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Inner Core */}
      <motion.div
        className="absolute w-[2px] h-[200px] bg-gradient-to-b from-transparent via-gold to-transparent"
        animate={{
          scaleY: [0.5, 1.5, 0.5],
          opacity: [0.2, 1, 0.2],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Connecting Nodes */}
      <svg className="absolute w-[400px] h-[400px] opacity-20" viewBox="0 0 400 400">
        <motion.circle
          cx="200"
          cy="200"
          r="100"
          stroke="url(#goldGradient)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4 8"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
        <motion.circle
          cx="200"
          cy="200"
          r="150"
          stroke="url(#goldGradient)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 12"
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C6A15B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#071A2E" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
