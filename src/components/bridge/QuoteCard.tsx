'use client'

import { motion } from 'framer-motion'
import { Zap, Clock, Star } from 'lucide-react'

export interface BridgeQuote {
  provider: 'layerzero' | 'relay'
  inputAmount: string
  outputAmount: string
  fee: string
  estimatedSeconds: number
}

interface QuoteCardProps {
  quote: BridgeQuote
  isBest?: boolean
  isSelected?: boolean
  onSelect: () => void
  token: string
}

const PROVIDER_META = {
  layerzero: {
    name: 'LayerZero',
    label: 'Stargate / OFT',
    color: 'from-lavender-100 to-lavender-50',
    border: 'border-lavender-200',
    selectedBorder: 'border-lavender-400',
    icon: '⬡',
    iconBg: 'bg-lavender-100',
    iconColor: 'text-lavender-600',
  },
  relay: {
    name: 'Relay',
    label: 'Token Discovery',
    color: 'from-mint-100 to-mint-50',
    border: 'border-mint-200',
    selectedBorder: 'border-mint-400',
    icon: '◈',
    iconBg: 'bg-mint-100',
    iconColor: 'text-mint-600',
  },
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `~${seconds}s`
  return `~${Math.round(seconds / 60)}m`
}

export function QuoteCard({ quote, isBest = false, isSelected = false, onSelect, token }: QuoteCardProps) {
  const meta = PROVIDER_META[quote.provider]

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative w-full text-left
        rounded-2xl border-2 p-4
        bg-gradient-to-br ${meta.color}
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-lavender-300
        ${isSelected
          ? `${meta.selectedBorder} shadow-lavender-glow`
          : `${meta.border} hover:shadow-pastel-md`
        }
      `}
    >
      {/* Best badge */}
      {isBest && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-2.5 left-1/2 -translate-x-1/2"
        >
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-lavender-mint text-white shadow-pastel-sm">
            <Star size={10} fill="currentColor" />
            Best
          </span>
        </motion.div>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-5 h-5 rounded-full bg-lavender-500 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        </div>
      )}

      {/* Provider header */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-8 h-8 rounded-xl ${meta.iconBg} flex items-center justify-center text-base ${meta.iconColor} font-bold`}>
          {meta.icon}
        </span>
        <div>
          <p className="font-bold text-gray-800 text-sm">{meta.name}</p>
          <p className="text-xs text-gray-500">{meta.label}</p>
        </div>
      </div>

      {/* Output amount */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-0.5">You receive</p>
        <p className="text-2xl font-bold text-gray-800">
          {parseFloat(quote.outputAmount).toFixed(4)}
          <span className="text-sm font-semibold text-gray-500 ml-1">{token}</span>
        </p>
      </div>

      {/* Fee + time row */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Zap size={11} className="text-peach-400" />
          <span>Fee: {parseFloat(quote.fee).toFixed(4)} {token}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={11} className="text-lavender-400" />
          <span>{formatTime(quote.estimatedSeconds)}</span>
        </div>
      </div>
    </motion.button>
  )
}
