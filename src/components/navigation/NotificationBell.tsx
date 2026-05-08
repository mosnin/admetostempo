'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, ArrowDownLeft, ArrowUpRight, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'

interface Notification {
  id: string
  type: 'received' | 'sent' | 'request' | 'request_paid' | 'system'
  title: string
  body: string
  read: boolean
  createdAt: string
  href?: string
}

const ICON_MAP = {
  received: { icon: ArrowDownLeft, bg: 'bg-emerald-100', color: 'text-emerald-600' },
  sent: { icon: ArrowUpRight, bg: 'bg-violet-100', color: 'text-violet-600' },
  request: { icon: DollarSign, bg: 'bg-amber-100', color: 'text-amber-600' },
  request_paid: { icon: Check, bg: 'bg-emerald-100', color: 'text-emerald-600' },
  system: { icon: Bell, bg: 'bg-slate-100', color: 'text-slate-600' },
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    if (open) fetchNotifications()
  }, [open])

  async function fetchNotifications() {
    setLoading(true)
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
      }
    } catch {}
    setLoading(false)
  }

  async function markAllRead() {
    await fetch('/api/notifications/read', { method: 'POST' })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  function handleClick(n: Notification) {
    if (!n.read) {
      fetch(`/api/notifications/${n.id}/read`, { method: 'PATCH' })
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))
    }
    if (n.href) { setOpen(false); router.push(n.href) }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/50 transition-colors"
      >
        <Bell size={20} className="text-slate-600" />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
          >
            {unread > 9 ? '9+' : unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 w-80 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button onClick={markAllRead} className="text-xs text-violet-500 hover:text-violet-700 font-medium">
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell size={32} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map(n => {
                    const { icon: Icon, bg, color } = ICON_MAP[n.type]
                    return (
                      <button
                        key={n.id}
                        onClick={() => handleClick(n)}
                        className={cn(
                          'w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left',
                          !n.read && 'bg-violet-50/50'
                        )}
                      >
                        <div className={cn('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5', bg)}>
                          <Icon size={16} className={color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm', !n.read ? 'font-semibold text-slate-800' : 'text-slate-600')}>{n.title}</p>
                          <p className="text-xs text-slate-400 truncate">{n.body}</p>
                          <p className="text-xs text-slate-300 mt-0.5">{formatRelativeTime(n.createdAt)}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0" />}
                      </button>
                    )
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
