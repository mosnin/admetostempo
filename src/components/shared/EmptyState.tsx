'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export interface EmptyStateProps {
  title: string
  subtitle?: string
  ctaLabel?: string
  onCta?: () => void
  ctaHref?: string
  illustration?: 'wallet' | 'search' | 'inbox' | 'activity' | 'custom'
  customIllustration?: React.ReactNode
  className?: string
}

// SVG illustrations using CSS/SVG only
function WalletIllustration() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="28" width="72" height="48" rx="12" fill="url(#walletGrad)" opacity="0.3" />
      <rect x="12" y="28" width="72" height="48" rx="12" stroke="#c4b5fd" strokeWidth="2" />
      <rect x="12" y="38" width="72" height="12" fill="#c4b5fd" opacity="0.4" />
      <circle cx="60" cy="56" r="6" fill="#a7f3d0" />
      <rect x="20" y="20" width="48" height="12" rx="6" fill="url(#walletGrad2)" opacity="0.5" />
      <defs>
        <linearGradient id="walletGrad" x1="12" y1="28" x2="84" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ede9fe" />
          <stop offset="1" stopColor="#d1fae5" />
        </linearGradient>
        <linearGradient id="walletGrad2" x1="20" y1="20" x2="68" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#a7f3d0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function SearchIllustration() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="42" cy="42" r="26" fill="url(#searchGrad)" opacity="0.3" />
      <circle cx="42" cy="42" r="26" stroke="#c4b5fd" strokeWidth="2.5" />
      <line x1="62" y1="62" x2="80" y2="80" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" />
      <line x1="34" y1="42" x2="50" y2="42" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="34" x2="42" y2="50" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="searchGrad" x1="16" y1="16" x2="68" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ede9fe" />
          <stop offset="1" stopColor="#d1fae5" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function InboxIllustration() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="24" width="64" height="52" rx="10" fill="url(#inboxGrad)" opacity="0.3" />
      <rect x="16" y="24" width="64" height="52" rx="10" stroke="#c4b5fd" strokeWidth="2" />
      <path d="M16 40 L48 58 L80 40" stroke="#c4b5fd" strokeWidth="2" strokeLinejoin="round" />
      <rect x="32" y="14" width="32" height="12" rx="6" fill="#a7f3d0" opacity="0.5" />
      <defs>
        <linearGradient id="inboxGrad" x1="16" y1="24" x2="80" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ede9fe" />
          <stop offset="1" stopColor="#ffedd5" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function ActivityIllustration() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="16" width="64" height="64" rx="12" fill="url(#actGrad)" opacity="0.25" />
      <polyline
        points="20,60 36,44 48,52 60,36 76,48"
        fill="none"
        stroke="url(#actLine)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="36" cy="44" r="4" fill="#c4b5fd" />
      <circle cx="48" cy="52" r="4" fill="#a7f3d0" />
      <circle cx="60" cy="36" r="4" fill="#fed7aa" />
      <defs>
        <linearGradient id="actGrad" x1="16" y1="16" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ede9fe" />
          <stop offset="1" stopColor="#d1fae5" />
        </linearGradient>
        <linearGradient id="actLine" x1="20" y1="60" x2="76" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#a7f3d0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const illustrations = {
  wallet: WalletIllustration,
  search: SearchIllustration,
  inbox: InboxIllustration,
  activity: ActivityIllustration,
  custom: null,
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.12,
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

function EmptyState({
  title,
  subtitle,
  ctaLabel,
  onCta,
  illustration = 'inbox',
  customIllustration,
  className,
}: EmptyStateProps) {
  const IllustrationComp = illustration !== 'custom' ? illustrations[illustration] : null

  return (
    <motion.div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated illustration */}
      <motion.div
        variants={itemVariants}
        className="mb-6"
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="relative inline-block">
          {/* Glow halo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ede9fe] to-[#d1fae5] blur-2xl opacity-60 scale-125" />
          <div className="relative">
            {customIllustration ?? (IllustrationComp && <IllustrationComp />)}
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        variants={itemVariants}
        className="text-lg font-bold text-[#1e1b4b] mb-2"
      >
        {title}
      </motion.h3>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          variants={itemVariants}
          className="text-sm text-[#6b7280] max-w-xs leading-relaxed mb-6"
        >
          {subtitle}
        </motion.p>
      )}

      {/* CTA */}
      {ctaLabel && onCta && (
        <motion.div variants={itemVariants}>
          <Button variant="primary" onClick={onCta}>
            {ctaLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export { EmptyState }
