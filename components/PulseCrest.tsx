'use client'
import { motion } from 'framer-motion'

interface Props {
  size?: number
  variant?: 'light' | 'dark' | 'gold'
  animate?: boolean
}

export function PulseCrest({ size = 80, variant = 'dark', animate = true }: Props) {
  const strokeColor = variant === 'gold' ? '#0B1622' : '#C9A84C'
  const fillColor = variant === 'light' ? '#F0EFE8' : '#111F2E'
  const gemColor = variant === 'gold' ? '#0B1622' : '#C9A84C'

  return (
    <motion.svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 130 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={animate ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Outer halo */}
      <ellipse cx="65" cy="72" rx="58" ry="62" stroke={strokeColor} strokeWidth="0.5" opacity="0.2" />
      {/* Shield body */}
      <path
        d="M65 12 L108 30 L108 82 Q108 122 65 140 Q22 122 22 82 L22 30 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.4"
      />
      {/* Inner shield line */}
      <path
        d="M65 22 L98 37 L98 80 Q98 112 65 128 Q32 112 32 80 L32 37 Z"
        fill="none"
        stroke={strokeColor}
        strokeWidth="0.4"
        opacity="0.35"
      />
      {/* Pulse waveform */}
      <polyline
        points="34,76 46,76 53,52 60,100 66,63 72,83 79,76 96,76"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top gem */}
      <circle cx="65" cy="12" r="5.5" fill={gemColor} />
      <circle cx="65" cy="12" r="9" fill="none" stroke={gemColor} strokeWidth="0.5" opacity="0.4" />
      {/* Corner gems */}
      <circle cx="108" cy="30" r="3" fill={gemColor} opacity="0.55" />
      <circle cx="22" cy="30" r="3" fill={gemColor} opacity="0.55" />
    </motion.svg>
  )
}
