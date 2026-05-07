'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b5fd] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-br from-[#c4b5fd] to-[#a7f3d0] text-[#1e1b4b] shadow-[0_4px_24px_rgba(196,181,253,0.4)] hover:shadow-[0_6px_32px_rgba(196,181,253,0.55)]',
        secondary:
          'bg-[#a7f3d0] text-[#065f46] shadow-[0_4px_16px_rgba(167,243,208,0.35)] hover:bg-[#6ee7b7]',
        ghost:
          'bg-transparent text-[#7c3aed] hover:bg-[#ede9fe]',
        destructive:
          'bg-[#ffe4e6] text-[#f43f5e] shadow-[0_4px_16px_rgba(251,113,133,0.25)] hover:bg-[#fb7185] hover:text-white',
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-xl',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-7 text-base rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </motion.button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
