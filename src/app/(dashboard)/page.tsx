'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import type { Transaction } from '@/types'

// ─── Transaction feed item ────────────────────────────────────────────────────

function TransactionFeedItem({ tx, index }: { tx: Transaction; index: number }) {
  const router = useRouter()

  // We don't have currentUserId client-side without auth context,
  // so use a heuristic: if the tx has from_profile, it's "sent by them".
  // The API should return relative to the current user, so we check
  // the direction via a "direction" field if present, else use to_profile.
  const isSent = (tx as Transaction & { direction?: string }).direction
    ? (tx as Transaction & { direction?: string }).direction === 'sent'
    : !tx.from_profile // if no from_profile on tx it's outgoing (sent)

  const otherProfile = isSent ? tx.to_profile : tx.from_profile
  const otherName =
    otherProfile?.display_name || otherProfile?.username || (tx.is_external ? 'External' : 'Unknown')
  const initials = otherName.slice(0, 2).toUpperCase()

  const amount = Number(tx.amount).toFixed(2)
  const relativeTime = formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })

  function handleClick() {
    if (otherProfile?.id) {
      router.push(`/history/${otherProfile.id}`)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={handleClick}
      className="glass rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-white/50 active:scale-[0.98] transition-all"
    >
      {/* Avatar */}
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
        style={{
          background: isSent
            ? 'linear-gradient(135deg, #c4b5fd, #a7f3d0)'
            : 'linear-gradient(135deg, #a7f3d0, #fed7aa)',
        }}
      >
        {otherProfile?.avatar_url ? (
          <img
            src={otherProfile.avatar_url}
            alt={initials}
            className="w-11 h-11 rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      {/* Name + memo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          {isSent ? (
            <ArrowUpRight size={12} className="text-lavender-400 flex-shrink-0" />
          ) : (
            <ArrowDownLeft size={12} className="text-emerald-400 flex-shrink-0" />
          )}
          <p className="font-semibold text-lavender-800 text-sm truncate">{otherName}</p>
        </div>
        {tx.memo && <p className="text-xs text-lavender-500 truncate">{tx.memo}</p>}
        <p className="text-xs text-lavender-400">{relativeTime}</p>
      </div>

      {/* Amount */}
      <div className="flex-shrink-0 text-right">
        <p className={`font-bold text-sm ${isSent ? 'text-lavender-800' : 'text-emerald-600'}`}>
          {isSent ? '-' : '+'}${amount}
        </p>
        <p className="text-xs text-lavender-400">{tx.currency}</p>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [balance, setBalance] = useState<string>('0.00')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/balance').then((r) => r.json()),
      fetch('/api/payments/history?limit=10').then((r) => r.json()),
    ])
      .then(([balData, txData]) => {
        setBalance(parseFloat(balData.balance || '0').toFixed(2))
        setTransactions(txData.transactions || [])
      })
      .catch(() => {
        // silently ignore — show zeros on error
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      {/* ── Balance card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-3xl p-6"
        style={{
          background:
            'linear-gradient(145deg, rgba(237,233,254,0.9) 0%, rgba(209,250,229,0.9) 100%)',
          boxShadow: '0 8px 32px rgba(196,181,253,0.2)',
        }}
      >
        <p className="text-sm font-medium mb-1" style={{ color: '#7c3aed' }}>
          Available balance
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold" style={{ color: '#3b0764' }}>
            ${loading ? '—' : balance}
          </span>
          <span className="text-lavender-500 text-sm">pathUSD</span>
        </div>

        <div className="flex gap-3 mt-6">
          <Link href="/send" className="flex-1">
            <button
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #c4b5fd, #a7f3d0)' }}
            >
              <ArrowUp size={18} />
              Send
            </button>
          </Link>
          <Link href="/request" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-lavender-700 bg-white/60 border border-lavender-200 transition-all hover:bg-white/80 active:scale-95">
              <ArrowDown size={18} />
              Request
            </button>
          </Link>
        </div>
      </motion.div>

      {/* ── Recent activity feed ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lavender-800">Recent activity</h2>
          <Link
            href="/history"
            className="text-sm text-lavender-500 hover:text-lavender-700 transition-colors"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl shimmer" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-lavender-400 text-lg">No activity yet</p>
            <p className="text-lavender-300 text-sm mt-1">
              Send your first payment to get started
            </p>
            <Link href="/send">
              <button
                className="mt-6 px-6 py-3 rounded-2xl font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #c4b5fd, #a7f3d0)' }}
              >
                Send payment
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx, i) => (
              <TransactionFeedItem key={tx.id} tx={tx} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
