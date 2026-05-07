'use client'
import { motion } from 'framer-motion'

export function PulseRing({ color = '#8B5CF6', size = 12 }: { color?: string; size?: number }) {
  return (
    <span className="relative inline-flex">
      <span className="inline-block rounded-full" style={{ width: size, height: size, backgroundColor: color }} />
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
      />
    </span>
  )
}
