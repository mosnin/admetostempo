'use client'
import { useRef } from 'react'
import { ChevronDown } from 'lucide-react'

const STABLECOINS = [
  { symbol: 'pathUSD', color: '#c4b5fd' },
  { symbol: 'AlphaUSD', color: '#a7f3d0' },
  { symbol: 'BetaUSD', color: '#fed7aa' },
  { symbol: 'ThetaUSD', color: '#fda4af' },
]

interface AmountInputProps {
  amount: string
  currency: string
  onChange: (amount: string) => void
  onCurrencyChange: (currency: string) => void
}

export function AmountInput({ amount, currency, onChange, onCurrencyChange }: AmountInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

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
    <div className="flex flex-col items-center gap-4">
      <div
        className="flex items-center gap-2 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <span className="text-5xl font-bold text-lavender-800">$</span>
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={handleChange}
          className="text-5xl font-bold text-lavender-800 bg-transparent border-none outline-none placeholder:text-lavender-300 w-40 text-center"
          style={{ minWidth: '60px', width: `${Math.max(3, amount.length)}ch` }}
        />
      </div>

      {/* Currency picker */}
      <div className="relative">
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="appearance-none pl-4 pr-8 py-2 rounded-full border border-lavender-200 bg-white/70 text-lavender-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-lavender-300 cursor-pointer"
        >
          {STABLECOINS.map((c) => (
            <option key={c.symbol} value={c.symbol}>
              {c.symbol}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-lavender-500 pointer-events-none"
        />
      </div>
    </div>
  )
}
