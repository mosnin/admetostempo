'use client'
import { StablecoinSelector, StablecoinSymbol } from './StablecoinSelector'
import { cn } from '@/lib/utils'

interface AmountInputProps {
  value: string
  onChange: (v: string) => void
  coin: StablecoinSymbol
  onCoinChange: (coin: StablecoinSymbol) => void
  error?: string
  className?: string
}

export function AmountInput({ value, onChange, coin, onCoinChange, error, className }: AmountInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9.]/g, '')
    // Only allow one decimal point
    const parts = raw.split('.')
    if (parts.length > 2) return
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) return
    onChange(raw)
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-2 bg-white/80 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-violet-300 focus-within:border-violet-300">
        <span className="text-2xl font-black text-slate-400">$</span>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="flex-1 text-3xl font-black text-slate-800 bg-transparent focus:outline-none placeholder-slate-200"
        />
        <StablecoinSelector value={coin} onChange={onCoinChange} />
      </div>
      {error && <p className="text-xs text-rose-500 px-1">{error}</p>}
    </div>
  )
}
