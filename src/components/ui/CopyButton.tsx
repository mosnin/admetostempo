'use client'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  value: string
  className?: string
  label?: string
}

export function CopyButton({ value, className, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    if (navigator.vibrate) navigator.vibrate(50)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={copy} className={cn('flex items-center gap-1.5 text-sm font-medium transition-colors', copied ? 'text-emerald-600' : 'text-violet-600 hover:text-violet-800', className)}>
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
            <Check className="w-4 h-4" /> {label ? 'Copied!' : ''}
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1.5">
            <Copy className="w-4 h-4" /> {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
