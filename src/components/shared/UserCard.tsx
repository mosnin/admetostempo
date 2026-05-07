'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'

export interface UserCardProps {
  userId: string
  displayName: string
  username: string
  avatarUrl?: string
  subtitle?: string
  className?: string
  compact?: boolean
  onClick?: () => void
}

function UserCard({
  userId,
  displayName,
  username,
  avatarUrl,
  subtitle,
  className,
  compact = false,
  onClick,
}: UserCardProps) {
  const router = useRouter()

  function handleClick() {
    if (onClick) {
      onClick()
    } else {
      router.push(`/profile/${username}`)
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors',
        'hover:bg-[rgba(196,181,253,0.12)] active:bg-[rgba(196,181,253,0.2)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b5fd]',
        className
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      <Avatar
        src={avatarUrl}
        name={displayName}
        size={compact ? 'sm' : 'md'}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#1e1b4b] leading-tight">
          {displayName}
        </p>
        <p className="truncate text-xs text-[#6b7280]">
          @{username}
          {subtitle && <span className="ml-1 text-[#9ca3af]">· {subtitle}</span>}
        </p>
      </div>
    </motion.button>
  )
}

export { UserCard }
