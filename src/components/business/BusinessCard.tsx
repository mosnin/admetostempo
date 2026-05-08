'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Building2, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Business {
  id?: string
  name: string
  username: string
  category: string
  description: string
  wallet_address?: string
  website?: string
  verified?: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  food: 'bg-[#ffedd5] text-[#fb923c]',
  retail: 'bg-[#ede9fe] text-[#7c3aed]',
  services: 'bg-[#d1fae5] text-[#10b981]',
  entertainment: 'bg-[#fce7f3] text-[#db2777]',
  health: 'bg-[#e0f2fe] text-[#0ea5e9]',
  tech: 'bg-[#ede9fe] text-[#6d28d9]',
  travel: 'bg-[#d1fae5] text-[#059669]',
  beauty: 'bg-[#fce7f3] text-[#ec4899]',
  education: 'bg-[#ffedd5] text-[#d97706]',
  all: 'bg-[#ede9fe] text-[#7c3aed]',
}

const AVATAR_GRADIENTS = [
  'from-[#c4b5fd] to-[#a7f3d0]',
  'from-[#a7f3d0] to-[#fed7aa]',
  'from-[#fed7aa] to-[#c4b5fd]',
  'from-[#fde68a] to-[#a7f3d0]',
  'from-[#c4b5fd] to-[#fbcfe8]',
]

function getGradient(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_GRADIENTS.length
  return AVATAR_GRADIENTS[idx]
}

export interface BusinessCardProps {
  business: Business
  className?: string
}

export function BusinessCard({ business, className }: BusinessCardProps) {
  const router = useRouter()
  const gradient = getGradient(business.name)
  const categoryColor = CATEGORY_COLORS[business.category] ?? CATEGORY_COLORS.all
  const initials = business.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  function handlePay(e: React.MouseEvent) {
    e.stopPropagation()
    const params = new URLSearchParams({ to: business.username, memo: `Payment to ${business.name}` })
    router.push(`/send?${params}`)
  }

  function handleCardClick() {
    router.push(`/business/${business.username}`)
  }

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(196,181,253,0.35)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={handleCardClick}
      className={cn(
        'cursor-pointer rounded-2xl overflow-hidden',
        'bg-white/70 backdrop-blur-[16px]',
        'border border-[rgba(196,181,253,0.2)]',
        'shadow-[0_4px_24px_rgba(196,181,253,0.2)]',
        className
      )}
    >
      {/* Avatar strip */}
      <div className={cn('h-16 bg-gradient-to-br flex items-center px-4', gradient)}>
        <div className="w-10 h-10 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm shadow-sm">
          {initials || <Building2 size={18} className="text-white" />}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1 gap-2">
          <h3 className="font-bold text-[#1e1b4b] text-sm leading-tight line-clamp-1">
            {business.name}
          </h3>
          {business.verified && (
            <span className="shrink-0 text-[#10b981] text-xs">✓</span>
          )}
        </div>

        <span
          className={cn(
            'inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2 capitalize',
            categoryColor
          )}
        >
          {business.category}
        </span>

        <p className="text-xs text-[#6b7280] line-clamp-2 mb-3 min-h-[2.4em]">
          {business.description}
        </p>

        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={handlePay}
          className="w-full py-2 rounded-xl bg-gradient-to-r from-[#c4b5fd] to-[#a7f3d0] text-[#1e1b4b] text-xs font-semibold shadow-[0_2px_8px_rgba(196,181,253,0.35)] hover:opacity-90 transition-opacity"
        >
          Pay
        </motion.button>
      </div>
    </motion.div>
  )
}
