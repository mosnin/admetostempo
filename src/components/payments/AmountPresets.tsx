'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const PRESETS = [
  { label: '$5', value: '5' },
  { label: '$10', value: '10' },
  { label: '$20', value: '20' },
  { label: '$50', value: '50' },
  { label: '$100', value: '100' },
]

export function AmountPresets({ onSelect, selected }: {
  onSelect: (value: string) => void
  selected?: string
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {PRESETS.map(({ label, value }) => (
        <motion.button
          key={value}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.04 }}
          onClick={() => onSelect(value)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all',
            selected === value
              ? 'bg-violet-500 text-white border-violet-500 shadow-lg shadow-violet-200'
              : 'bg-white/80 text-slate-600 border-slate-200 hover:border-violet-300'
          )}
        >
          {label}
        </motion.button>
      ))}
    </div>
  )
}
