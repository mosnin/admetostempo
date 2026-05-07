'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/bridge', label: 'Bridge' },
  { href: '/history', label: 'History' },
]

interface TopNavProps {
  unreadCount?: number
}

function TopNav({ unreadCount = 0 }: TopNavProps) {
  const pathname = usePathname()
  const { user } = useUser()

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

        {/* Right: Bell + Avatar */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <motion.button
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3ff] text-[#7c3aed] transition-colors hover:bg-[#ede9fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b5fd]"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
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
          </motion.button>

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
