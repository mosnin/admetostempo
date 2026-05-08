'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Bell,
  BellOff,
  Check,
  ArrowDownLeft,
  ArrowUpRight,
  UserPlus,
  DollarSign,
  ChevronLeft,
  Inbox,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useNotifications } from '@/hooks/useNotifications'
import { formatRelativeTime } from '@/lib/utils'

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface Notification {
  id: string
  type: string
  title: string
  message: string
  avatar?: string
  username?: string
  amount?: number
  read: boolean
  created_at: string
  href: string
}

type Tab = 'all' | 'payments' | 'social'

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function getNotificationIcon(type: string) {
  switch (type) {
    case 'payment_received':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d1fae5]">
          <ArrowDownLeft size={16} className="text-[#10b981]" />
        </div>
      )
    case 'payment_sent':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ede9fe]">
          <ArrowUpRight size={16} className="text-[#7c3aed]" />
        </div>
      )
    case 'payment_request':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffedd5]">
          <DollarSign size={16} className="text-[#fb923c]" />
        </div>
      )
    case 'request_paid':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d1fae5]">
          <Check size={16} className="text-[#10b981]" />
        </div>
      )
    case 'new_follower':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e0f2fe]">
          <UserPlus size={16} className="text-[#0ea5e9]" />
        </div>
      )
    case 'business_payment':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fef9c3]">
          <DollarSign size={16} className="text-[#ca8a04]" />
        </div>
      )
    default:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ede9fe]">
          <Bell size={16} className="text-[#7c3aed]" />
        </div>
      )
  }
}

function isPaymentType(type: string) {
  return ['payment_received', 'payment_sent', 'payment_request', 'request_paid', 'business_payment'].includes(type)
}

function isSocialType(type: string) {
  return ['new_follower'].includes(type)
}

function groupByDate(notifications: Notification[]) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart.getTime() - 86400000)
  const weekStart = new Date(todayStart.getTime() - 6 * 86400000)

  const groups: { label: string; items: Notification[] }[] = [
    { label: 'Today', items: [] },
    { label: 'Yesterday', items: [] },
    { label: 'This week', items: [] },
    { label: 'Earlier', items: [] },
  ]

  for (const n of notifications) {
    const d = new Date(n.created_at)
    if (d >= todayStart) {
      groups[0].items.push(n)
    } else if (d >= yesterdayStart) {
      groups[1].items.push(n)
    } else if (d >= weekStart) {
      groups[2].items.push(n)
    } else {
      groups[3].items.push(n)
    }
  }

  return groups.filter(g => g.items.length > 0)
}

/* ─────────────────────────────────────────
   Swipeable notification row
───────────────────────────────────────── */
function NotificationRow({
  notification,
  onDismiss,
  index,
}: {
  notification: Notification
  onDismiss: (id: string) => void
  index: number
}) {
  const router = useRouter()
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-120, -60, 0], [0, 0.4, 1])
  const background = useTransform(
    x,
    [-120, 0],
    ['rgba(244,63,94,0.15)', 'rgba(244,63,94,0)']
  )

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x < -80) {
      onDismiss(notification.id)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -200, height: 0, marginBottom: 0 }}
      transition={{
        layout: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { delay: index * 0.04, duration: 0.3 },
        y: { delay: index * 0.04, type: 'spring', stiffness: 260, damping: 24 },
      }}
      className="relative overflow-hidden rounded-2xl mb-2"
    >
      {/* Swipe-to-dismiss red bg */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end px-5 rounded-2xl"
        style={{ background }}
      >
        <span className="text-[#f43f5e] text-xs font-semibold">Dismiss</span>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -140, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        style={{ x, opacity }}
        className={`relative flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-colors
          ${notification.read
            ? 'bg-white/60 hover:bg-white/80'
            : 'bg-white/90 hover:bg-white shadow-[0_2px_12px_rgba(196,181,253,0.2)]'
          }`}
        onClick={() => router.push(notification.href)}
        whileTap={{ scale: 0.985 }}
      >
        {/* Avatar + icon overlay */}
        <div className="relative shrink-0">
          <Avatar
            src={notification.avatar}
            name={notification.username || notification.title}
            size="md"
          />
          <div className="absolute -bottom-1 -right-1">
            {getNotificationIcon(notification.type)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-semibold truncate ${notification.read ? 'text-[#6b7280]' : 'text-[#1e1b4b]'}`}>
              {notification.title}
            </p>
            <span className="text-[11px] text-[#9ca3af] whitespace-nowrap shrink-0">
              {formatRelativeTime(notification.created_at)}
            </span>
          </div>
          <p className="text-sm text-[#6b7280] mt-0.5 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
          {notification.amount && (
            <Badge
              variant={notification.type === 'payment_request' ? 'pending' : 'confirmed'}
              className="mt-1.5"
            >
              {notification.type === 'payment_request' ? '-' : '+'}${notification.amount}
            </Badge>
          )}
        </div>

        {/* Unread dot */}
        {!notification.read && (
          <motion.div
            className="shrink-0 w-2 h-2 rounded-full bg-[#7c3aed] mt-1.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   Main page
───────────────────────────────────────── */

// Mock notifications for demo / empty-state fallback seed
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'mock-1',
    type: 'payment_received',
    title: 'Payment received',
    message: 'Alex Chen sent you $24.50 · Coffee split',
    avatar: undefined,
    username: 'alexchen',
    amount: 24.50,
    read: false,
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    href: '/history',
  },
  {
    id: 'mock-2',
    type: 'payment_request',
    title: 'Payment request',
    message: 'Jamie Park is requesting $15.00 · Lunch',
    avatar: undefined,
    username: 'jamiepark',
    amount: 15.00,
    read: false,
    created_at: new Date(Date.now() - 35 * 60000).toISOString(),
    href: '/request',
  },
  {
    id: 'mock-3',
    type: 'payment_sent',
    title: 'Payment sent',
    message: 'You sent $8.99 to Sam Rivera · Streaming',
    avatar: undefined,
    username: 'samrivera',
    amount: 8.99,
    read: true,
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    href: '/history',
  },
  {
    id: 'mock-4',
    type: 'new_follower',
    title: 'New follower',
    message: 'Taylor Smith started following you',
    avatar: undefined,
    username: 'taylorsmith',
    read: true,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    href: '/profile/taylorsmith',
  },
  {
    id: 'mock-5',
    type: 'request_paid',
    title: 'Request fulfilled',
    message: 'Jordan Lee paid your $50.00 request · Rent split',
    avatar: undefined,
    username: 'jordanlee',
    amount: 50.00,
    read: true,
    created_at: new Date(Date.now() - 26 * 3600000).toISOString(),
    href: '/history',
  },
  {
    id: 'mock-6',
    type: 'business_payment',
    title: 'Business payment received',
    message: 'Acme Corp sent $320.00 · Invoice #1042',
    avatar: undefined,
    username: 'acmecorp',
    amount: 320.00,
    read: true,
    created_at: new Date(Date.now() - 28 * 3600000).toISOString(),
    href: '/history',
  },
]

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'payments', label: 'Payments' },
  { key: 'social', label: 'Social' },
]

export default function NotificationsPage() {
  const { notifications: apiNotifications, unreadCount, loading, markAllRead, dismiss } = useNotifications()
  const [activeTab, setActiveTab] = useState<Tab>('all')

  // Merge API notifications with mocks (mocks fill in when API returns empty)
  const notifications = useMemo(() => {
    if (!loading && apiNotifications.length === 0) return MOCK_NOTIFICATIONS
    // Merge: prefer API, append mocks that don't collide
    return apiNotifications.length > 0 ? apiNotifications : MOCK_NOTIFICATIONS
  }, [apiNotifications, loading])

  const filtered = useMemo(() => {
    if (activeTab === 'payments') return notifications.filter(n => isPaymentType(n.type))
    if (activeTab === 'social') return notifications.filter(n => isSocialType(n.type))
    return notifications
  }, [notifications, activeTab])

  const groups = useMemo(() => groupByDate(filtered), [filtered])

  const displayUnread = loading ? 0 : (apiNotifications.length > 0 ? unreadCount : MOCK_NOTIFICATIONS.filter(n => !n.read).length)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf5ff] via-[#f0fdf4] to-[#fefce8]">
      {/* Header */}
      <motion.div
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-[16px] border-b border-[rgba(196,181,253,0.2)]"
        style={{ boxShadow: '0 4px 24px rgba(196,181,253,0.15)' }}
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Back + title */}
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f3ff] text-[#7c3aed] hover:bg-[#ede9fe] transition-colors"
              >
                <ChevronLeft size={20} />
              </Link>
              <div>
                <h1 className="text-lg font-extrabold text-[#1e1b4b] tracking-tight flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, -15, 15, -10, 0] }}
                    transition={{ duration: 1.2, delay: 0.4, ease: 'easeInOut' }}
                  >
                    <Bell size={20} className="text-[#7c3aed]" />
                  </motion.div>
                  Notifications
                  {displayUnread > 0 && (
                    <motion.span
                      className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f43f5e] px-1.5 text-[11px] font-bold text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.3 }}
                    >
                      {displayUnread > 99 ? '99+' : displayUnread}
                    </motion.span>
                  )}
                </h1>
              </div>
            </div>

            {/* Mark all read */}
            {displayUnread > 0 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllRead}
                  leftIcon={<Check size={14} />}
                  className="text-[#7c3aed] text-xs"
                >
                  Mark all read
                </Button>
              </motion.div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-[#f5f3ff] rounded-2xl">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative flex-1 py-2 text-sm font-semibold rounded-xl transition-colors focus-visible:outline-none"
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(196,181,253,0.3)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${activeTab === tab.key ? 'text-[#7c3aed]' : 'text-[#9ca3af]'}`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-4 pb-32">
        {loading ? (
          /* Skeleton */
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 p-4 rounded-2xl bg-white/60"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="h-10 w-10 rounded-full bg-[#ede9fe] animate-pulse" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3.5 w-1/3 rounded-full bg-[#ede9fe] animate-pulse" />
                  <div className="h-3 w-2/3 rounded-full bg-[#f5f3ff] animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#f5f3ff]">
              <BellOff size={36} className="text-[#c4b5fd]" />
            </div>
            <h3 className="text-lg font-bold text-[#1e1b4b] mb-2">All caught up!</h3>
            <p className="text-sm text-[#9ca3af] max-w-xs">
              {activeTab === 'all'
                ? "You don't have any notifications yet."
                : activeTab === 'payments'
                ? 'No payment notifications.'
                : 'No social notifications.'}
            </p>
            <Link href="/dashboard" className="mt-6">
              <Button variant="ghost" size="sm">Go to Dashboard</Button>
            </Link>
          </motion.div>
        ) : (
          /* Notification groups */
          <AnimatePresence mode="popLayout">
            {groups.map((group, gi) => (
              <motion.div
                key={group.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: gi * 0.08 }}
                className="mb-5"
              >
                {/* Group label */}
                <motion.p
                  className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest mb-2 px-1"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: gi * 0.08 + 0.1 }}
                >
                  {group.label}
                </motion.p>

                {/* Items */}
                <AnimatePresence mode="popLayout">
                  {group.items.map((notification, i) => (
                    <NotificationRow
                      key={notification.id}
                      notification={notification}
                      onDismiss={dismiss}
                      index={i + gi * 3}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Footer hint */}
        {!loading && filtered.length > 0 && (
          <motion.div
            className="mt-6 flex flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Inbox size={16} className="text-[#d1d5db]" />
            <p className="text-xs text-[#d1d5db]">Swipe left to dismiss</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
