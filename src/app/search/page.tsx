'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, User, Building2, Receipt } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatAmount, formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'

type TabType = 'all' | 'people' | 'businesses' | 'transactions'

interface SearchResults {
  users: Array<{ id: string; username: string; display_name: string; avatar_url: string | null; bio: string | null }>
  businesses: Array<{ id: string; username: string; business_name: string; description: string | null; category: string }>
  transactions: Array<{ id: string; amount: number; currency: string; memo: string | null; created_at: string; status: string; other_profile?: { username: string; display_name: string } }>
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<TabType>('all')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const search = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) { setResults(null); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data)
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300)
    return () => clearTimeout(timer)
  }, [query, search])

  const tabs: { key: TabType; label: string; icon: typeof User }[] = [
    { key: 'all', label: 'All', icon: Search },
    { key: 'people', label: 'People', icon: User },
    { key: 'businesses', label: 'Businesses', icon: Building2 },
    { key: 'transactions', label: 'Transactions', icon: Receipt },
  ]

  const hasResults = results && (results.users.length > 0 || results.businesses.length > 0 || results.transactions.length > 0)

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search people, businesses, transactions..."
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-300 text-slate-800 placeholder-slate-400 font-medium"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults(null) }} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors">
            <X size={12} className="text-slate-600" />
          </button>
        )}
      </div>

      {/* Tabs */}
      {results && (
        <div className="flex gap-1 bg-white/60 rounded-2xl p-1 backdrop-blur-sm">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${tab === key ? 'bg-white shadow-sm text-violet-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} variant="list-item" className="h-16 rounded-2xl" />)}
          </motion.div>
        ) : query.length < 2 ? (
          <motion.div key="empty-prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <Search size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">Search people, businesses, and transactions</p>
            <p className="text-sm text-slate-300 mt-1">Type at least 2 characters</p>
          </motion.div>
        ) : !hasResults ? (
          <motion.div key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-slate-500 font-medium">No results for &quot;{query}&quot;</p>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* People */}
            {(tab === 'all' || tab === 'people') && results!.users.length > 0 && (
              <section>
                {tab === 'all' && <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">People</h3>}
                <div className="space-y-2">
                  {results!.users.map((user, i) => (
                    <motion.div key={user.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <Link href={`/profile/${user.username}`} className="flex items-center gap-3 p-3 bg-white/70 hover:bg-white/90 rounded-2xl transition-all shadow-sm">
                        <Avatar src={user.avatar_url || undefined} name={user.display_name || user.username} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{user.display_name}</p>
                          <p className="text-sm text-slate-400">@{user.username}</p>
                          {user.bio && <p className="text-xs text-slate-400 truncate">{user.bio}</p>}
                        </div>
                        <Link href={`/send?to=${user.username}`} onClick={e => e.stopPropagation()} className="px-3 py-1.5 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-xl text-xs font-semibold transition-colors">
                          Pay
                        </Link>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Businesses */}
            {(tab === 'all' || tab === 'businesses') && results!.businesses.length > 0 && (
              <section>
                {tab === 'all' && <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Businesses</h3>}
                <div className="space-y-2">
                  {results!.businesses.map((biz, i) => (
                    <motion.div key={biz.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <Link href={`/business/${biz.username}`} className="flex items-center gap-3 p-3 bg-white/70 hover:bg-white/90 rounded-2xl transition-all shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-emerald-400 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                          {biz.business_name.slice(0, 1)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{biz.business_name}</p>
                          <p className="text-xs text-slate-400 capitalize">{biz.category}</p>
                          {biz.description && <p className="text-xs text-slate-400 truncate">{biz.description}</p>}
                        </div>
                        <Badge variant="confirmed">{biz.category}</Badge>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Transactions */}
            {(tab === 'all' || tab === 'transactions') && results!.transactions.length > 0 && (
              <section>
                {tab === 'all' && <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Transactions</h3>}
                <div className="space-y-2">
                  {results!.transactions.map((tx, i) => (
                    <motion.div key={tx.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <div className="flex items-center justify-between p-3 bg-white/70 rounded-2xl shadow-sm">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{tx.memo || 'Payment'}</p>
                          <p className="text-xs text-slate-400">{tx.other_profile ? `@${tx.other_profile.username}` : 'External'} · {formatRelativeTime(tx.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-800">{formatAmount(tx.amount)}</p>
                          <Badge variant={tx.status === 'confirmed' ? 'confirmed' : tx.status === 'failed' ? 'failed' : 'pending'}>{tx.status}</Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
