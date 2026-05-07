'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const STABLECOINS = [
  { symbol: 'pathUSD', label: 'pathUSD', description: 'Primary Tempo stablecoin', color: 'violet', icon: '🔮' },
  { symbol: 'AlphaUSD', label: 'AlphaUSD', description: 'Alpha test stablecoin', color: 'emerald', icon: '🌿' },
  { symbol: 'BetaUSD', label: 'BetaUSD', description: 'Beta test stablecoin', color: 'orange', icon: '🍊' },
  { symbol: 'ThetaUSD', label: 'ThetaUSD', description: 'Theta test stablecoin', color: 'blue', icon: '💎' },
] as const

export type StablecoinSymbol = typeof STABLECOINS[number]['symbol']

interface StablecoinSelectorProps {
  value: StablecoinSymbol
  onChange: (coin: StablecoinSymbol) => void
  className?: string
}

export function StablecoinSelector({ value, onChange, className }: StablecoinSelectorProps) {
  const [open, setOpen] = useState(false)
  const selected = STABLECOINS.find(c => c.symbol === value) || STABLECOINS[0]

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-xl border border-slate-200 hover:border-violet-300 transition-all text-sm font-semibold text-slate-700"
      >
        <span>{selected.icon}</span>
        <span>{selected.symbol}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-1 right-0 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 z-20 overflow-hidden"
            >
              {STABLECOINS.map(coin => (
                <button
                  key={coin.symbol}
                  type="button"
                  onClick={() => { onChange(coin.symbol); setOpen(false) }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors',
                    coin.symbol === value && 'bg-violet-50'
                  )}
                >
                  <span className="text-xl">{coin.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-sm">{coin.label}</p>
                    <p className="text-xs text-slate-400">{coin.description}</p>
                  </div>
                  {coin.symbol === value && <Check size={14} className="text-violet-500" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
