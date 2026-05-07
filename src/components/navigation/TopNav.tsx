'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bell, Search } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useNotifications } from '@/hooks/useNotifications'
import { useCommandPalette } from '@/hooks/useCommandPalette'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/bridge', label: 'Bridge' },
  { href: '/history', label: 'History' },
]

interface TopNavProps {
  unreadCount?: number
}

function TopNav({ unreadCount: unreadCountProp }: TopNavProps) {
  const pathname = usePathname()
  const { user } = useUser()
  const { unreadCount: liveUnreadCount } = useNotifications()
  // Prefer live count from hook; fall back to prop if hook hasn't loaded yet
  const unreadCount = liveUnreadCount > 0 ? liveUnreadCount : (unreadCountProp ?? 0)
  const { open: openPalette } = useCommandPalette()

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-[16px] border-b border-[rgba(196,181,253,0.2)]"
      style={{ boxShadow: '0 4px 24px rgba(196,181,253,0.15)' }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex h-full max-w-7xl mx-auto items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-xl font-extrabold tracking-tight select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b5fd] rounded-lg px-1"
        >
          <span className="text-gradient">admetos</span>
        </Link>

        {/* Search pill — opens command palette */}
        <button
          onClick={openPalette}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 border border-gray-200/60 text-xs text-gray-400 hover:bg-white/80 hover:border-[#c4b5fd] hover:text-gray-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b5fd]"
          aria-label="Open command palette"
        >
          <Search className="w-3 h-3" />
          <span>Search…</span>
          <kbd className="ml-1 px-1.5 py-0.5 text-[10px] bg-gray-100 rounded font-mono leading-none">⌘K</kbd>
        </button>

        {/* Center Nav — desktop only */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-xl transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b5fd]',
                  isActive
                    ? 'text-[#7c3aed]'
                    : 'text-[#6b7280] hover:text-[#7c3aed] hover:bg-[#f5f3ff]'
                )}
              >
                {label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#c4b5fd]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right: Language + Bell + Avatar */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          {/* Theme toggle */}
          <ThemeToggle />
          {/* Notification bell */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Link
              href="/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3ff] text-[#7c3aed] transition-colors hover:bg-[#ede9fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b5fd]"
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <motion.span
                  className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f43f5e] px-1 text-[10px] font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.span>
              )}
            </Link>
          </motion.div>

          {/* Profile avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Link
              href="/profile"
              className="block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b5fd] focus-visible:ring-offset-2"
            >
              <Avatar
                src={user?.imageUrl}
                name={user?.fullName ?? user?.username ?? ''}
                size="sm"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}

export { TopNav }
