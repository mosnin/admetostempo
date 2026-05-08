'use client'
import { motion } from 'framer-motion'

const SUGGESTIONS = [
  { emoji: '🍕', label: 'Pizza' },
  { emoji: '☕', label: 'Coffee' },
  { emoji: '🍻', label: 'Drinks' },
  { emoji: '🚗', label: 'Ride' },
  { emoji: '🏠', label: 'Rent' },
  { emoji: '🎬', label: 'Movies' },
  { emoji: '🛒', label: 'Groceries' },
  { emoji: '🎁', label: 'Gift' },
  { emoji: '✈️', label: 'Trip' },
  { emoji: '🎮', label: 'Gaming' },
  { emoji: '💪', label: 'Gym' },
  { emoji: '📚', label: 'Books' },
]

export function MemoSuggestions({ onSelect }: { onSelect: (memo: string) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Quick memos</p>
      <div className="flex gap-2 flex-wrap">
        {SUGGESTIONS.map(({ emoji, label }) => (
          <motion.button
            key={label}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05, y: -1 }}
            onClick={() => onSelect(`${emoji} ${label}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 hover:bg-white rounded-full text-sm text-slate-600 border border-slate-200 hover:border-violet-200 hover:shadow-sm transition-all"
          >
            <span className="text-base">{emoji}</span>
            <span className="font-medium">{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
