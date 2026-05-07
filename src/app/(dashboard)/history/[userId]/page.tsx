'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { format, isToday, isYesterday } from 'date-fns'
import type { Transaction } from '@/types'

interface ConversationTx extends Transaction {
  direction?: 'sent' | 'received'
}

function dateSeparatorLabel(dateStr: string) {
  const d = new Date(dateStr)
  if (isToday(d)) return 'Today'
  if (isYesterday(d)) return 'Yesterday'
  return format(d, 'MMMM d, yyyy')
}

function isSameDay(a: string, b: string) {
  return format(new Date(a), 'yyyy-MM-dd') === format(new Date(b), 'yyyy-MM-dd')
}

export default function ConversationPage() {
  const { userId } = useParams<{ userId: string }>()
  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<ConversationTx[]>([])
  const [otherUser, setOtherUser] = useState<{ username?: string; display_name?: string; avatar_url?: string | null } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/payments/conversation/${userId}`)
      .then((r) => r.json())
      .then((data) => {
        const txs: ConversationTx[] = data.transactions || []
        setMessages(txs)
        // Pick the other user's profile from either side of the first tx
        const first = txs[0]
        if (first) {
          const other = first.direction === 'sent' ? first.to_profile : first.from_profile
          setOtherUser(other || null)
        }
        // Try dedicated field
        if (data.otherUser) setOtherUser(data.otherUser)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  // Scroll to bottom when messages load
  useEffect(() => {
    if (!loading) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [loading, messages.length])

  const displayName = otherUser?.display_name || otherUser?.username || 'User'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col"
      style={{ minHeight: 'calc(100vh - 80px - 80px)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-white/60 text-lavender-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #c4b5fd, #a7f3d0)' }}
        >
          {otherUser?.avatar_url ? (
            <img src={otherUser.avatar_url} alt={initials} className="w-10 h-10 rounded-full object-cover" />
          ) : initials}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-lavender-800">{displayName}</p>
          {otherUser?.username && (
            <p className="text-xs text-lavender-500">@{otherUser.username}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-1 pb-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`h-14 rounded-2xl shimmer ${i % 2 === 0 ? 'w-48' : 'w-40'}`} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-lavender-400">
            <p className="text-lg">No payments yet</p>
            <p className="text-sm mt-1">Start a conversation by sending a payment</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((tx, i) => {
              const isSent = tx.direction === 'sent'
              const showDateSep = i === 0 || !isSameDay(tx.created_at, messages[i - 1].created_at)

              return (
                <div key={tx.id}>
                  {/* Date separator */}
                  {showDateSep && (
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-lavender-200/50" />
                      <p className="text-xs text-lavender-400 font-medium">
                        {dateSeparatorLabel(tx.created_at)}
                      </p>
                      <div className="flex-1 h-px bg-lavender-200/50" />
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}
                  >
                    <div
                      className={`max-w-[72%] rounded-3xl px-4 py-3 shadow-sm ${
                        isSent
                          ? 'rounded-br-lg text-white'
                          : 'rounded-bl-lg bg-white/80 border border-lavender-200/40'
                      }`}
                      style={
                        isSent
                          ? { background: 'linear-gradient(135deg, #c4b5fd, #a7f3d0)' }
                          : {}
                      }
                    >
                      {/* Memo */}
                      {tx.memo && (
                        <p className={`text-sm mb-1.5 ${isSent ? 'text-white' : 'text-lavender-800'}`}>
                          {tx.memo}
                        </p>
                      )}

                      {/* Amount */}
                      <div className={`flex items-center gap-1.5 ${isSent ? 'text-white/90' : 'text-lavender-700'}`}>
                        {isSent ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
                        <span className="font-bold text-sm">
                          {isSent ? '-' : '+'}${Number(tx.amount).toFixed(2)}
                        </span>
                        <span className="text-xs opacity-70">{tx.currency}</span>
                      </div>

                      {/* Time */}
                      <p className={`text-[10px] mt-1 ${isSent ? 'text-white/60' : 'text-lavender-400'}`}>
                        {format(new Date(tx.created_at), 'h:mm a')}
                        {tx.status === 'pending' && ' · pending'}
                        {tx.status === 'failed' && ' · failed'}
                      </p>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Bottom actions */}
      <div className="sticky bottom-0 pt-4 pb-2 bg-gradient-to-t from-white/20 to-transparent">
        <div className="flex gap-3">
          <Link href={`/send?to=${otherUser?.username || ''}`} className="flex-1">
            <button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #c4b5fd, #a7f3d0)' }}
            >
              <ArrowUp size={16} /> Send
            </button>
          </Link>
          <Link href={`/request?from=${otherUser?.username || ''}`} className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-lavender-700 bg-white/70 border border-lavender-200 text-sm">
              <ArrowDown size={16} /> Request
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
