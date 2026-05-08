'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#1e1b4b]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[#a78bfa] flex items-center pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-xl border bg-white/80 px-4 py-2.5 text-sm text-[#1e1b4b] placeholder:text-[#9ca3af]',
              'transition-all duration-200 outline-none',
              'border-[#e8e4fd]',
              'focus:border-[#c4b5fd] focus:ring-2 focus:ring-[#c4b5fd]/30',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-[#fb7185] focus:border-[#fb7185] focus:ring-[#fb7185]/30',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-[#a78bfa] flex items-center pointer-events-none">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-[#f43f5e] font-medium">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-[#6b7280]">{hint}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1e1b4b]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border bg-white/80 px-4 py-2.5 text-sm text-[#1e1b4b] placeholder:text-[#9ca3af]',
            'transition-all duration-200 outline-none resize-none',
            'border-[#e8e4fd]',
            'focus:border-[#c4b5fd] focus:ring-2 focus:ring-[#c4b5fd]/30',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[#fb7185] focus:border-[#fb7185] focus:ring-[#fb7185]/30',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#f43f5e] font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-[#6b7280]">{hint}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Input, Textarea }
