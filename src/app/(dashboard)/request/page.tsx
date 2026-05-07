'use client'
import { Suspense, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { Inbox, ArrowRight, CheckCircle, XCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import { RequestForm } from '@/components/payments'
import type { PaymentRequest } from '@/types'

// ─── Pending requests list ────────────────────────────────────────────────────

function PendingRequests() {
  const router = useRouter()
  const [requests, setRequests] = useState<PaymentRequest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch('/api/payments/request')
      if (res.ok) {
        const data = await res.json()
        setRequests(data.requests || [])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchRequests() }, [fetchRequests])

  async function handleDecline(id: string) {
    try {
      const res = await fetch(`/api/payments/request/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'declined' }),
      })
      if (!res.ok) throw new Error('Failed to decline')
      toast.success('Request declined')
      setRequests((prev) => prev.filter((r) => r.id !== id))
    } catch {
      toast.error('Could not decline request')
    }
  }

  function handlePay(req: PaymentRequest) {
    const username = req.from_profile?.username
    if (username) {
      router.push(`/send?to=${username}&amount=${req.amount}&currency=${req.memo || ''}`)
    } else {
      router.push('/send')
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl shimmer" />)}
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-10 text-lavender-400">
        <Inbox size={36} className="mx-auto mb-2 opacity-40" />
        <p className="text-sm">No pending requests</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {requests.map((req, i) => {
          const requester = req.from_profile
          const name = requester?.display_name || requester?.username || 'Someone'
          const initials = name.slice(0, 2).toUpperCase()
          const relativeTime = formatDistanceToNow(new Date(req.created_at), { addSuffix: true })

          return (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #a7f3d0, #fed7aa)' }}
                >
                  {requester?.avatar_url ? (
                    <img src={requester.avatar_url} alt={initials} className="w-10 h-10 rounded-full object-cover" />
                  ) : initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lavender-800 text-sm">{name} requested</p>
                  {req.memo && <p className="text-xs text-lavender-500 truncate">{req.memo}</p>}
                  <p className="text-xs text-lavender-400">{relativeTime}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-lavender-800">${Number(req.amount).toFixed(2)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDecline(req.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  <XCircle size={14} /> Decline
                </button>
                <button
                  onClick={() => handlePay(req)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #a7f3d0, #fed7aa)' }}
                >
                  <CheckCircle size={14} /> Pay <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function RequestPageInner() {
  const params = useSearchParams()
  const defaultFrom = params.get('from') || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Request form */}
      <div>
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-lavender-800">Request</h1>
          <p className="text-sm text-lavender-500 mt-0.5">Request stablecoins from someone</p>
        </div>
        <div className="glass rounded-3xl p-6">
          <RequestForm defaultUsername={defaultFrom} />
        </div>
      </div>

      {/* Pending incoming requests */}
      <div>
        <h2 className="font-semibold text-lavender-800 mb-4">Requests from others</h2>
        <PendingRequests />
      </div>
    </motion.div>
  )
}

export default function RequestPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="h-8 rounded-xl shimmer w-28" />
          <div className="h-64 rounded-3xl shimmer" />
        </div>
      }
    >
      <RequestPageInner />
    </Suspense>
  )
}
