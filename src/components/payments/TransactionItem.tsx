'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ExternalLink, Copy, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import toast from 'react-hot-toast'
import type { Transaction } from '@/types'
import { useRouter } from 'next/navigation'

interface TransactionItemProps {
  tx: Transaction
  currentUserId?: string
  showConversation?: boolean
}

function getInitials(name?: string | null) {
  if (!name) return '?'
  return name.slice(0, 2).toUpperCase()
}

function truncateHash(hash: string) {
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`
}

export function TransactionItem({ tx, currentUserId, showConversation = true }: TransactionItemProps) {
  const [expanded, setExpanded] = useState(false)
  const router = useRouter()

  const isSent = tx.from_profile_id === currentUserId
  const otherProfile = isSent ? tx.to_profile : tx.from_profile
  const otherName = otherProfile?.display_name || otherProfile?.username || (tx.is_external ? 'External' : 'Unknown')
  const initials = getInitials(otherName)

  const amount = `${isSent ? '-' : '+'}$${Number(tx.amount).toFixed(2)}`
  const amountColor = isSent ? 'text-lavender-800' : 'text-emerald-600'

  const relativeTime = formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })
  const fullTime = format(new Date(tx.created_at), 'MMM d, yyyy h:mm a')

  function copyHash() {
    if (tx.tx_hash) {
      navigator.clipboard.writeText(tx.tx_hash)
      toast.success('Copied!')
    }
  }

  function handleAvatarClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (showConversation && otherProfile?.id) {
      router.push(`/history/${otherProfile.id}`)
    }
  }

  return (
    <motion.div
      layout
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Main row */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/40 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-lavender-300"
          style={{ background: isSent ? 'linear-gradient(135deg, #c4b5fd, #a7f3d0)' : 'linear-gradient(135deg, #a7f3d0, #fed7aa)' }}
          onClick={handleAvatarClick}
          title={showConversation && otherProfile?.id ? `Chat with ${otherName}` : undefined}
        >
          {otherProfile?.avatar_url ? (
            <img src={otherProfile.avatar_url} alt={initials} className="w-10 h-10 rounded-full object-cover" />
          ) : initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {isSent ? <ArrowUpRight size={12} className="text-lavender-400" /> : <ArrowDownLeft size={12} className="text-emerald-400" />}
            <p className="font-semibold text-lavender-800 truncate text-sm">{otherName}</p>
          </div>
          {tx.memo && <p className="text-xs text-lavender-500 truncate">{tx.memo}</p>}
          <p className="text-xs text-lavender-400">{relativeTime}</p>
        </div>

        {/* Amount + chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`font-bold text-sm ${amountColor}`}>{amount}</span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-lavender-400" />
          </motion.div>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-3 border-t border-lavender-200/30">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-lavender-400 mb-0.5">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                    tx.status === 'confirmed' ? 'bg-mint-100 text-emerald-700' :
                    tx.status === 'pending' ? 'bg-peach-100 text-amber-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {tx.status}
                  </span>
                </div>
                <div>
                  <p className="text-lavender-400 mb-0.5">Currency</p>
                  <p className="text-lavender-700 font-medium">{tx.currency}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-lavender-400 mb-0.5">Date</p>
                  <p className="text-lavender-700">{fullTime}</p>
                </div>
              </div>

              {tx.tx_hash && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-lavender-50/70 border border-lavender-200/40">
                  <p className="font-mono text-xs text-lavender-600 flex-1 truncate">{truncateHash(tx.tx_hash)}</p>
                  <button onClick={copyHash} className="p-1 hover:text-lavender-700 text-lavender-400">
                    <Copy size={13} />
                  </button>
                  <a
                    href={`https://explorer.tempo.network/tx/${tx.tx_hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 hover:text-lavender-700 text-lavender-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
