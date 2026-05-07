'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import {
  Search,
  ArrowUpRight,
  Wallet,
  History,
  Compass,
  GitMerge,
  Settings,
  User,
  Send,
  DollarSign,
  LayoutDashboard,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCommandPalette } from '@/hooks/useCommandPalette'

// ─── Types ─────────────────────────────────────────────────────────────────

interface CommandItem {
  id: string
  label: string
  shortcut?: string
  icon: React.ReactNode
  href?: string
  action?: () => void
  section: 'quick-actions' | 'pages' | 'recent-people'
}

// ─── Static command data ────────────────────────────────────────────────────

const QUICK_ACTIONS: CommandItem[] = [
  {
    id: 'send-money',
    label: 'Send Money',
    shortcut: 'S',
    icon: <Send className="w-4 h-4" />,
    href: '/send',
    section: 'quick-actions',
  },
  {
    id: 'request-money',
    label: 'Request Money',
    shortcut: 'R',
    icon: <DollarSign className="w-4 h-4" />,
    href: '/request',
    section: 'quick-actions',
  },
  {
    id: 'explore-businesses',
    label: 'Explore Businesses',
    shortcut: 'E',
    icon: <Compass className="w-4 h-4" />,
    href: '/explore',
    section: 'quick-actions',
  },
  {
    id: 'bridge-tokens',
    label: 'Bridge Tokens',
    shortcut: 'B',
    icon: <GitMerge className="w-4 h-4" />,
    href: '/bridge',
    section: 'quick-actions',
  },
  {
    id: 'view-history',
    label: 'View History',
    shortcut: 'H',
    icon: <History className="w-4 h-4" />,
    href: '/history',
    section: 'quick-actions',
  },
]

const PAGES: CommandItem[] = [
  {
    id: 'page-dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-4 h-4" />,
    href: '/dashboard',
    section: 'pages',
  },
  {
    id: 'page-wallet',
    label: 'Wallet',
    icon: <Wallet className="w-4 h-4" />,
    href: '/wallet',
    section: 'pages',
  },
  {
    id: 'page-settings',
    label: 'Settings',
    icon: <Settings className="w-4 h-4" />,
    href: '/settings',
    section: 'pages',
  },
  {
    id: 'page-profile',
    label: 'Profile',
    icon: <User className="w-4 h-4" />,
    href: '/profile',
    section: 'pages',
  },
  {
    id: 'page-bridge',
    label: 'Bridge',
    icon: <GitMerge className="w-4 h-4" />,
    href: '/bridge',
    section: 'pages',
  },
]

// Static example recent contacts — in production these come from profile search history
const RECENT_PEOPLE: CommandItem[] = [
  {
    id: 'person-alice',
    label: 'Alice Johnson',
    icon: <User className="w-4 h-4" />,
    href: '/send?to=alice',
    section: 'recent-people',
  },
  {
    id: 'person-bob',
    label: 'Bob Martinez',
    icon: <User className="w-4 h-4" />,
    href: '/send?to=bob',
    section: 'recent-people',
  },
]

const ALL_COMMANDS: CommandItem[] = [...QUICK_ACTIONS, ...RECENT_PEOPLE, ...PAGES]

// ─── Fuzzy filter ───────────────────────────────────────────────────────────

function fuzzyMatch(query: string, text: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  const t = text.toLowerCase()
  if (t.includes(q)) return true
  // Character-by-character fuzzy match
  let qi = 0
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++
  }
  return qi === q.length
}

// ─── Section label component ────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 select-none">
      {children}
    </div>
  )
}

// ─── Command row component ──────────────────────────────────────────────────

interface CommandRowProps {
  item: CommandItem
  isHighlighted: boolean
  onSelect: (item: CommandItem) => void
  onMouseEnter: () => void
}

function CommandRow({ item, isHighlighted, onSelect, onMouseEnter }: CommandRowProps) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors group',
        isHighlighted
          ? 'bg-[#f5f3ff] text-[#7c3aed]'
          : 'text-gray-700 hover:bg-gray-50'
      )}
      onMouseEnter={onMouseEnter}
      onClick={() => onSelect(item)}
    >
      {/* Icon */}
      <span
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-lg shrink-0 transition-colors',
          isHighlighted
            ? 'bg-[#ede9fe] text-[#7c3aed]'
            : 'bg-gray-100 text-gray-500 group-hover:bg-[#ede9fe] group-hover:text-[#7c3aed]'
        )}
      >
        {item.icon}
      </span>

      {/* Label */}
      <span className="flex-1 text-sm font-medium truncate">{item.label}</span>

      {/* Keyboard shortcut or navigate arrow */}
      {item.shortcut ? (
        <kbd
          className={cn(
            'hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono border transition-colors',
            isHighlighted
              ? 'bg-[#ede9fe] border-[#c4b5fd] text-[#7c3aed]'
              : 'bg-gray-100 border-gray-200 text-gray-400'
          )}
        >
          {item.shortcut}
        </kbd>
      ) : (
        <ArrowUpRight
          className={cn(
            'w-3.5 h-3.5 shrink-0 transition-opacity',
            isHighlighted ? 'opacity-100 text-[#7c3aed]' : 'opacity-0 text-gray-400'
          )}
        />
      )}
    </button>
  )
}

// ─── Main CommandPalette component ──────────────────────────────────────────

export function CommandPalette() {
  const router = useRouter()
  const { isOpen, open, close } = useCommandPalette()

  const [query, setQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)

  // ── Global Cmd+K / Ctrl+K listener ──────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        open()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // ── Reset state when opening ─────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setHighlightedIndex(0)
      // Defer focus until after animation frame so Dialog renders input
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }, [isOpen])

  // ── Filtered results ─────────────────────────────────────────────────────
  const filtered = ALL_COMMANDS.filter((item) => fuzzyMatch(query, item.label))

  // Keep highlighted index in bounds when results change
  useEffect(() => {
    setHighlightedIndex((prev) => (prev >= filtered.length ? 0 : prev))
  }, [filtered.length])

  // ── Select handler ───────────────────────────────────────────────────────
  const handleSelect = useCallback(
    (item: CommandItem) => {
      close()
      if (item.action) {
        item.action()
      } else if (item.href) {
        router.push(item.href)
      }
    },
    [close, router]
  )

  // ── Keyboard navigation inside palette ───────────────────────────────────
  function handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev + 1) % Math.max(filtered.length, 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1))
        break
      case 'Enter':
        e.preventDefault()
        if (filtered[highlightedIndex]) {
          handleSelect(filtered[highlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        close()
        break
    }
  }

  // ── Grouped sections for rendering ───────────────────────────────────────
  const quickActions = filtered.filter((i) => i.section === 'quick-actions')
  const recentPeople = filtered.filter((i) => i.section === 'recent-people')
  const pages = filtered.filter((i) => i.section === 'pages')

  // Build a flat ordered list so we can map item → index for highlighting
  const orderedFiltered = [...quickActions, ...recentPeople, ...pages]

  return (
    <Dialog.Root open={isOpen} onOpenChange={(v) => (v ? open() : close())}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </Dialog.Overlay>

            {/* Panel */}
            <Dialog.Content asChild onKeyDown={handleKeyDown}>
              <motion.div
                className="fixed left-1/2 top-[10vh] z-[101] w-full max-w-xl -translate-x-1/2 outline-none"
                initial={{ y: -24, opacity: 0, scale: 0.97 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -16, opacity: 0, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.8 }}
              >
                <div className="mx-4 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                  {/* Search input row */}
                  <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      ref={inputRef}
                      className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                      placeholder="Search actions, pages, people…"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value)
                        setHighlightedIndex(0)
                      }}
                      autoComplete="off"
                      spellCheck={false}
                    />
                    {query && (
                      <button
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setQuery('')}
                        tabIndex={-1}
                        aria-label="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-100 text-gray-400 border border-gray-200">
                      Esc
                    </kbd>
                  </div>

                  {/* Results list */}
                  <div className="max-h-[60vh] overflow-y-auto overscroll-contain p-2 space-y-0.5">
                    {orderedFiltered.length === 0 && (
                      <div className="py-10 text-center text-sm text-gray-400">
                        No results for &ldquo;{query}&rdquo;
                      </div>
                    )}

                    {/* Quick Actions */}
                    {quickActions.length > 0 && (
                      <div>
                        <SectionLabel>Quick Actions</SectionLabel>
                        {quickActions.map((item) => {
                          const idx = orderedFiltered.indexOf(item)
                          return (
                            <CommandRow
                              key={item.id}
                              item={item}
                              isHighlighted={idx === highlightedIndex}
                              onSelect={handleSelect}
                              onMouseEnter={() => setHighlightedIndex(idx)}
                            />
                          )
                        })}
                      </div>
                    )}

                    {/* Recent People */}
                    {recentPeople.length > 0 && (
                      <div>
                        <SectionLabel>Recent People</SectionLabel>
                        {recentPeople.map((item) => {
                          const idx = orderedFiltered.indexOf(item)
                          return (
                            <CommandRow
                              key={item.id}
                              item={item}
                              isHighlighted={idx === highlightedIndex}
                              onSelect={handleSelect}
                              onMouseEnter={() => setHighlightedIndex(idx)}
                            />
                          )
                        })}
                      </div>
                    )}

                    {/* Pages */}
                    {pages.length > 0 && (
                      <div>
                        <SectionLabel>Pages</SectionLabel>
                        {pages.map((item) => {
                          const idx = orderedFiltered.indexOf(item)
                          return (
                            <CommandRow
                              key={item.id}
                              item={item}
                              isHighlighted={idx === highlightedIndex}
                              onSelect={handleSelect}
                              onMouseEnter={() => setHighlightedIndex(idx)}
                            />
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Footer hint */}
                  <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2 text-[10px] text-gray-400 select-none">
                    <span className="flex items-center gap-1.5">
                      <kbd className="inline-flex items-center px-1 py-0.5 rounded bg-gray-100 border border-gray-200 font-mono">↑</kbd>
                      <kbd className="inline-flex items-center px-1 py-0.5 rounded bg-gray-100 border border-gray-200 font-mono">↓</kbd>
                      to navigate
                    </span>
                    <span className="flex items-center gap-1.5">
                      <kbd className="inline-flex items-center px-1 py-0.5 rounded bg-gray-100 border border-gray-200 font-mono">↵</kbd>
                      to select
                    </span>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
