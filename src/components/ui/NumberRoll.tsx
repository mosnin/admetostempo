'use client'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

export function NumberRoll({ value, prefix = '$', decimals = 2, className = '' }: {
  value: number; prefix?: string; decimals?: number; className?: string
}) {
  const motionValue = useMotionValue(0)
  const display = useTransform(motionValue, (v) => `${prefix}${v.toFixed(decimals)}`)

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 1, ease: 'easeOut' })
    return controls.stop
  }, [value, motionValue])

  return <motion.span className={className}>{display}</motion.span>
}
