'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, formatRelativeTime } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import type { BadgeVariant } from '@/components/ui/Badge'
import { AmountDisplay } from '@/components/ui/AmountDisplay'
import { ChevronDown } from 'lucide-react'

export type TransactionStatus = 'confirmed' | 'pending' | 'failed'
export type TransactionDirection = 'sent' | 'received'

export interface TransactionItemProps {
  id: string
  counterpartyName: string
  counterpartyUsername: string
  counterpartyAvatarUrl?: string
  memo?: string
  amount: number
  currency?: string
  direction: TransactionDirection
  status: TransactionStatus
  timestamp: string | Date
  className?: string
  details?: React.ReactNode
}

const statusBadgeVariant: Record<TransactionStatus, BadgeVariant> = {
  confirmed: 'confirmed',
  pending: 'pending',
  failed: 'failed',
}

const statusLabel: Record<TransactionStatus, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  failed: 'Failed',
}

function TransactionItem({
  counterpartyName,
  counterpartyUsername,
  counterpartyAvatarUrl,
  memo,
  amount,
  currency = 'USDC',
  direction,
  status,
  timestamp,
  className,
  details,
}: TransactionItemProps) {
  const [expanded, setExpanded] = React.useState(false)

  const isReceived = direction === 'received'

  return (
    <motion.div
      layout
      className={cn(
        'overflow-hidden rounded-2xl bg-white/70 backdrop-blur-[12px]',
        'border border-[rgba(196,181,253,0.15)]',
        'shadow-[0_2px_12px_rgba(196,181,253,0.15)]',
        className
      )}
    >
      {/* Main row */}
      <motion.button
        type="button"
        onClick={() => details && setExpanded((e) => !e)}
        className={cn(
          'flex w-full items-center gap-3 p-4 text-left',
          details && 'hover:bg-[rgba(196,181,253,0.06)] transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c4b5fd]'
        )}
        whileHover={details ? { scale: 1.002 } : {}}
        whileTap={details ? { scale: 0.998 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Avatar */}
        <Avatar
          src={counterpartyAvatarUrl}
          name={counterpartyName}
          size="md"
        />

        {/* Name + Memo */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-[#1e1b4b]">
              {counterpartyName}
            </p>
            <Badge variant={statusBadgeVariant[status]} className="shrink-0">
              {statusLabel[status]}
            </Badge>
          </div>
          {memo && (
            <p className="mt-0.5 truncate text-xs text-[#6b7280]">{memo}</p>
          )}
          <p className="mt-0.5 text-xs text-[#9ca3af]">
            @{counterpartyUsername} · {formatRelativeTime(timestamp)}
          </p>
        </div>

        {/* Amount + chevron */}
        <div className="flex shrink-0 flex-col items-end gap-1">
          <AmountDisplay
            amount={amount}
            currency={currency}
            size="sm"
            variant={isReceived ? 'received' : 'default'}
            showSign={isReceived}
            animateChange={false}
          />
          {details && (
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <ChevronDown size={14} className="text-[#9ca3af]" />
            </motion.span>
          )}
        </div>
      </motion.button>

      {/* Expandable details */}
      <AnimatePresence initial={false}>
        {expanded && details && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[rgba(196,181,253,0.15)] px-4 py-3">
              {details}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export { TransactionItem }
