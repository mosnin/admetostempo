'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const sizeMap = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

function Spinner({ size = 'md', className, label = 'Loading…' }: SpinnerProps) {
  return (
    <motion.div
      className={cn('inline-flex items-center justify-center', className)}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      role="status"
      aria-label={label}
    >
      <svg
        className={cn(sizeMap[size])}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#e8e4fd"
          strokeWidth="3"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="#c4b5fd"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  )
}

export { Spinner }
