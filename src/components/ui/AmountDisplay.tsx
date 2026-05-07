'use client'

import * as React from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface AmountDisplayProps {
  amount: number
  currency?: string
  currencySymbol?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'received' | 'sent' | 'muted'
  showSign?: boolean
  className?: string
  animateChange?: boolean
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-6xl',
}

const variantClasses = {
  default: 'text-[#1e1b4b]',
  received: 'text-[#10b981]',
  sent: 'text-[#1e1b4b]',
  muted: 'text-[#6b7280]',
}

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 200, damping: 30 })
  const display = useTransform(spring, (v) =>
    v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  )

  React.useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span>{display}</motion.span>
}

function AmountDisplay({
  amount,
  currency = 'USDC',
  currencySymbol = '$',
  size = 'lg',
  variant = 'default',
  showSign = false,
  className,
  animateChange = true,
}: AmountDisplayProps) {
  const sign = showSign && amount > 0 ? '+' : ''

  return (
    <div className={cn('flex items-baseline gap-1 font-bold tabular-nums', className)}>
      <span
        className={cn(
          'text-[0.45em] font-semibold opacity-70',
          sizeClasses[size],
          variantClasses[variant]
        )}
      >
        {currencySymbol}
      </span>
      <span className={cn('font-extrabold', sizeClasses[size], variantClasses[variant])}>
        {sign}
        {animateChange ? (
          <AnimatedNumber value={Math.abs(amount)} />
        ) : (
          Math.abs(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        )}
      </span>
      {currency && (
        <span
          className={cn(
            'text-[0.35em] font-medium opacity-60',
            sizeClasses[size],
            variantClasses[variant]
          )}
        >
          {currency}
        </span>
      )}
    </div>
  )
}

export { AmountDisplay }
