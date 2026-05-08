'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/Skeleton'
import { BusinessCard, Business } from './BusinessCard'

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

export interface BusinessGridProps {
  businesses: Business[]
  loading?: boolean
  emptyMessage?: string
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/70 border border-[rgba(196,181,253,0.2)] shadow-[0_4px_24px_rgba(196,181,253,0.15)]">
      <Skeleton variant="rect" height={64} className="rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="rect" height={20} width={64} className="rounded-full" />
        <Skeleton variant="text" lines={2} />
        <Skeleton variant="rect" height={32} className="rounded-xl" />
      </div>
    </div>
  )
}

export function BusinessGrid({ businesses, loading, emptyMessage = 'No businesses found' }: BusinessGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-4xl mb-3">🏪</p>
        <p className="text-[#6b7280] font-medium">{emptyMessage}</p>
        <p className="text-[#9ca3af] text-sm mt-1">Be the first to set up a business!</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {businesses.map((biz) => (
        <motion.div key={biz.username} variants={item}>
          <BusinessCard business={biz} />
        </motion.div>
      ))}
    </motion.div>
  )
}
