'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Building2, Users, Star, Bot } from 'lucide-react'
import { CategoryChips } from '@/components/business/CategoryChips'
import { BusinessGrid } from '@/components/business/BusinessGrid'
import { AgentHub } from '@/components/business/AgentHub'
import { UserCard } from '@/components/shared/UserCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { Business } from '@/components/business/BusinessCard'

type Tab = 'businesses' | 'people' | 'featured' | 'ai-hub'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'businesses', label: 'Businesses', icon: Building2 },
  { id: 'people', label: 'People', icon: Users },
  { id: 'featured', label: 'Featured', icon: Star },
  { id: 'ai-hub', label: 'AI Hub', icon: Bot },
]

// Mock featured businesses for demo
const FEATURED_BUSINESSES: Business[] = [
  {
    name: 'Tempo Coffee',
    username: 'tempo_coffee',
    category: 'food',
    description: 'Specialty coffee roasted fresh every morning. Pay seamlessly with pathUSD.',
    verified: true,
  },
  {
    name: 'Pixel Market',
    username: 'pixel_market',
    category: 'retail',
    description: 'Digital goods, art prints, and NFT-adjacent physical merch.',
    verified: true,
  },
  {
    name: 'Wellness Hub',
    username: 'wellness_hub',
    category: 'health',
    description: 'Yoga, meditation, and wellness services bookable on-chain.',
    verified: false,
  },
]

interface UserResult {
  userId: string
  displayName: string
  username: string
  avatarUrl?: string
}

function PeopleTab() {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<UserResult[]>([])
  const [loading, setLoading] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    if (timer.current) clearTimeout(timer.current)
    if (q.trim().length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.users ?? [])
        }
      } catch {
        /* silent */
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a78bfa]">
          <Search size={16} />
        </span>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search by name or @username..."
          className="w-full pl-9 pr-4 py-3 rounded-2xl border border-[#e8e4fd] bg-white/70 backdrop-blur-sm text-sm text-[#1e1b4b] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#c4b5fd]/50"
        />
      </div>

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="list-item" />
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="rounded-2xl bg-white/70 border border-[rgba(196,181,253,0.2)] divide-y divide-[#f3f0ff] overflow-hidden">
          {results.map((user) => (
            <UserCard
              key={user.userId}
              userId={user.userId}
              displayName={user.displayName}
              username={user.username}
              avatarUrl={user.avatarUrl}
              subtitle="Tap to pay or view profile"
            />
          ))}
        </div>
      )}

      {!loading && query.length >= 2 && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-[#6b7280] font-medium">No users found for "{query}"</p>
          <p className="text-[#9ca3af] text-sm mt-1">Try a different name or username</p>
        </div>
      )}

      {query.length < 2 && (
        <div className="text-center py-12 text-[#9ca3af] text-sm">
          Start typing to search for people
        </div>
      )}
    </div>
  )
}

function BusinessesTab() {
  const [category, setCategory] = React.useState('all')
  const [query, setQuery] = React.useState('')
  const [businesses, setBusinesses] = React.useState<Business[]>([])
  const [loading, setLoading] = React.useState(true)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    setLoading(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams()
        if (category !== 'all') params.set('category', category)
        if (query.trim()) params.set('q', query.trim())
        const res = await fetch(`/api/business?${params}`)
        if (res.ok) {
          const data = await res.json()
          setBusinesses(data.businesses ?? [])
        } else {
          setBusinesses([])
        }
      } catch {
        setBusinesses([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [category, query])

  return (
    <div className="space-y-4">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a78bfa]">
          <Search size={16} />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search businesses..."
          className="w-full pl-9 pr-4 py-3 rounded-2xl border border-[#e8e4fd] bg-white/70 backdrop-blur-sm text-sm text-[#1e1b4b] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#c4b5fd]/50"
        />
      </div>

      <CategoryChips selected={category} onSelect={setCategory} />

      <BusinessGrid businesses={businesses} loading={loading} />
    </div>
  )
}

function FeaturedTab() {
  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#c4b5fd]/40 to-[#a7f3d0]/40 border border-[rgba(196,181,253,0.3)] p-6">
        <div className="flex items-center gap-2 mb-2">
          <Star size={18} className="text-[#7c3aed]" fill="currentColor" />
          <span className="text-sm font-semibold text-[#7c3aed]">Editor's Picks</span>
        </div>
        <h2 className="text-xl font-bold text-[#1e1b4b] mb-1">Featured on Admetos</h2>
        <p className="text-sm text-[#6b7280]">
          Curated businesses leading the way in on-chain payments.
        </p>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3">
          Top Picks This Week
        </h3>
        <BusinessGrid businesses={FEATURED_BUSINESSES} loading={false} />
      </div>

      <div className="rounded-2xl bg-white/60 border border-[rgba(196,181,253,0.2)] p-5">
        <p className="text-sm font-semibold text-[#1e1b4b] mb-1">Want to be featured?</p>
        <p className="text-xs text-[#6b7280] mb-3">
          Apply to have your business highlighted on the Explore page.
        </p>
        <a
          href="mailto:hello@admetos.xyz"
          className="text-sm font-semibold text-[#7c3aed] hover:text-[#6d28d9] transition-colors"
        >
          Apply now →
        </a>
      </div>
    </div>
  )
}

const tabVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 26 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

export default function ExplorePage() {
  const [activeTab, setActiveTab] = React.useState<Tab>('businesses')

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      >
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#c4b5fd] via-[#7c3aed] to-[#a7f3d0] bg-clip-text text-transparent mb-1">
          Explore Admetos
        </h1>
        <p className="text-sm text-[#6b7280]">
          Discover businesses, people, and AI-powered payment tools.
        </p>
      </motion.div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white/60 backdrop-blur-sm rounded-2xl p-1 border border-[rgba(196,181,253,0.2)]">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <motion.button
              key={tab.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-[#c4b5fd] to-[#a7f3d0] text-[#1e1b4b] shadow-[0_2px_8px_rgba(196,181,253,0.35)]'
                  : 'text-[#6b7280] hover:text-[#7c3aed]',
              ].join(' ')}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          {activeTab === 'businesses' && <BusinessesTab />}
          {activeTab === 'people' && <PeopleTab />}
          {activeTab === 'featured' && <FeaturedTab />}
          {activeTab === 'ai-hub' && <AgentHub />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
