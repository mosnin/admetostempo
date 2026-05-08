'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'food', label: 'Food & Dining' },
  { value: 'retail', label: 'Retail' },
  { value: 'services', label: 'Services' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health', label: 'Health' },
  { value: 'tech', label: 'Tech' },
  { value: 'travel', label: 'Travel' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'education', label: 'Education' },
]

export interface CategoryChipsProps {
  selected: string
  onSelect: (value: string) => void
  className?: string
}

export function CategoryChips({ selected, onSelect, className }: CategoryChipsProps) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto pb-2 scrollbar-hide', className)}>
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.value
        return (
          <motion.button
            key={cat.value}
            type="button"
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => onSelect(cat.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0',
              isActive
                ? 'bg-gradient-to-r from-[#c4b5fd] to-[#a7f3d0] text-[#1e1b4b] shadow-[0_4px_12px_rgba(196,181,253,0.4)]'
                : 'border border-[#e8e4fd] text-[#6b7280] bg-white/70 hover:bg-[#ede9fe] hover:text-[#7c3aed]'
            )}
          >
            {cat.label}
          </motion.button>
        )
      })}
    </div>
  )
}
