'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'confirmed' | 'pending' | 'failed' | 'external' | 'default'

const variantClasses: Record<BadgeVariant, string> = {
  confirmed: 'bg-[#d1fae5] text-[#10b981]',
  pending: 'bg-[#ffedd5] text-[#fb923c]',
  failed: 'bg-[#ffe4e6] text-[#f43f5e]',
  external: 'bg-[#e0f2fe] text-[#0ea5e9]',
  default: 'bg-[#ede9fe] text-[#7c3aed]',
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge }
