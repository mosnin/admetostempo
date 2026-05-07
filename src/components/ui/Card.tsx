'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'pastel' | 'flat'
  header?: React.ReactNode
  footer?: React.ReactNode
  hoverable?: boolean
}

const variantClasses = {
  glass:
    'bg-white/70 backdrop-blur-[16px] border border-[rgba(196,181,253,0.2)] shadow-[0_4px_24px_rgba(196,181,253,0.25)]',
  pastel:
    'bg-gradient-to-br from-[rgba(237,233,254,0.8)] to-[rgba(209,250,229,0.8)] border border-[rgba(196,181,253,0.2)] shadow-[0_4px_24px_rgba(196,181,253,0.25)]',
  flat: 'bg-white border border-[#e8e4fd] shadow-[0_2px_16px_rgba(139,92,246,0.08)]',
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = 'glass', header, footer, hoverable = false, children, ...props },
    ref
  ) => {
    const Comp = hoverable ? motion.div : 'div'
    const motionProps = hoverable
      ? {
          whileHover: { y: -4, boxShadow: '0 8px 32px rgba(196,181,253,0.4)' },
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        }
      : {}

    return (
      <Comp
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn('rounded-2xl overflow-hidden', variantClasses[variant], className)}
        {...motionProps}
        {...props}
      >
        {header && (
          <div className="px-5 py-4 border-b border-[rgba(196,181,253,0.15)]">{header}</div>
        )}
        <div className="p-5">{children}</div>
        {footer && (
          <div className="px-5 py-4 border-t border-[rgba(196,181,253,0.15)]">{footer}</div>
        )}
      </Comp>
    )
  }
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-5 pt-5 pb-0', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-semibold text-[#1e1b4b] leading-tight', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-5 py-4 border-t border-[rgba(196,181,253,0.15)] flex items-center',
        className
      )}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardContent, CardFooter }
