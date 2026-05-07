'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import {
  isToday,
  isYesterday,
  isThisWeek,
  format,
} from 'date-fns'
import Link from 'next/link'
import { TransactionItem } from '@/components/payments'
import type { Transaction } from '@/types'

type FilterTab = 'all' | 'sent' | 'received' | 'requests'

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'sent', label: 'Sent' },
  { key: 'received', label: 'Received' },
  { key: 'requests', label: 'Requests' },
]

const PAGE_SIZE = 20

function groupByDate(txs: Transaction[]): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {}
  for (const tx of txs) {
    const d = new Date(tx.created_at)
    let label: string
    if (isToday(d)) label = 'Today'
    else if (isYesterday(d)) label = 'Yesterday'
    else if (isThisWeek(d, { weekStartsOn: 1 })) label = 'This week'
    else label = format(d, 'MMMM yyyy')

    if (!groups[label]) groups[label] = []
    groups[label].push(tx)
  }
  return groups
}

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [search, setSearch] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const fetchPage = useCallback(async (pageNum: number, tab: FilterTab, append: boolean) => {
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(pageNum * PAGE_SIZE),
      })
      if (tab !== 'all' && tab !== 'requests') params.set('direction', tab)
      if (tab === 'requests') params.set('type', 'requests')

      const res = await fetch(`/api/payments/history?${params}`)
      if (!res.ok) return
      const data = await res.json()
      const newTxs: Transaction[] = data.transactions || []
      setTransactions((prev: Transaction[]) => append ? [...prev, ...newTxs] : newTxs)
      setHasMore(newTxs.length === PAGE_SIZE)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    setPage(0)
    setTransactions([])
    fetchPage(0, activeTab, false)
  }, [activeTab, fetchPage])

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true)
          const next = page + 1
          setPage(next)
          fetchPage(next, activeTab, true)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, page, activeTab, fetchPage])

  // Client-side filter by search
  const filtered = search.trim()
    ? transactions.filter((tx: Transaction) => {
        const q = search.toLowerCase()
        return (
          tx.memo?.toLowerCase().includes(q) ||
          tx.from_profile?.username?.toLowerCase().includes(q) ||
          tx.from_profile?.display_name?.toLowerCase().includes(q) ||
          tx.to_profile?.username?.toLowerCase().includes(q) ||
          tx.to_profile?.display_name?.toLowerCase().includes(q) ||
          tx.tx_hash?.toLowerCase().includes(q)
        )
      })
    : transactions

  const groups = groupByDate(filtered)
  const groupLabels = Object.keys(groups)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-2xl font-bold text-lavender-800">History</h1>
        <p className="text-sm text-lavender-500 mt-0.5">All your transactions in one place</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'text-white shadow-sm'
                : 'text-lavender-600 bg-white/60 border border-lavender-200 hover:bg-lavender-50'
            }`}
            style={activeTab === tab.key ? { background: 'linear-gradient(135deg, #c4b5fd, #a7f3d0)' } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-400" />
        <input
          type="text"
          placeholder="Search by name, memo, or hash..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-lavender-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-lavender-300 text-sm text-lavender-800 placeholder:text-lavender-300"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-lavender-400 hover:text-lavender-600"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-16 rounded-2xl shimmer" />)}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <p className="text-lavender-400 text-lg">
            {search ? 'No results found' : 'No transactions yet'}
          </p>
          {!search && (
            <Link href="/send">
              <button
                className="mt-4 px-6 py-3 rounded-2xl font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #c4b5fd, #a7f3d0)' }}
              >
                Send your first payment
              </button>
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {groupLabels.map((label) => (
              <motion.div
                key={label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <p className="text-xs font-semibold text-lavender-400 uppercase tracking-wider px-1">
                  {label}
                </p>
                {groups[label].map((tx: Transaction, i: number) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <TransactionItem tx={tx} showConversation />
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-4" />
          {loadingMore && (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-2xl shimmer" />)}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
