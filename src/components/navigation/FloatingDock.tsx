'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, ArrowUp, ArrowDown, Compass, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const DOCK_ITEMS = [
  { href: '/dashboard', icon: Home, label: 'Home', badgeKey: null },
  { href: '/send', icon: ArrowUp, label: 'Send', badgeKey: null },
  { href: '/request', icon: ArrowDown, label: 'Request', badgeKey: 'pendingRequests' },
  { href: '/explore', icon: Compass, label: 'Explore', badgeKey: null },
  { href: '/profile', icon: User, label: 'Profile', badgeKey: null },
] as const

interface FloatingDockProps {
  pendingRequests?: number
}

interface DockItemProps {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
  badge?: number
}

function DockItem({ href, icon: Icon, label, isActive, badge }: DockItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.18 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="relative"
    >
      <Link
        href={href}
        className="relative flex flex-col items-center gap-1 p-2 focus-visible:outline-none"
        aria-label={label}
        aria-current={isActive ? 'page' : undefined}
      >
        <motion.div
          className={cn(
            'relative flex h-11 w-11 items-center justify-center rounded-2xl transition-colors',
            isActive
              ? 'bg-gradient-to-br from-[#c4b5fd] to-[#a7f3d0] shadow-[0_4px_16px_rgba(196,181,253,0.5)]'
              : 'bg-transparent hover:bg-[rgba(196,181,253,0.15)]'
          )}
          animate={
            isActive
              ? { boxShadow: '0 4px 20px rgba(196,181,253,0.6)' }
              : { boxShadow: '0px 0px 0px rgba(196,181,253,0)' }
          }
          transition={{ duration: 0.25 }}
        >
          <Icon
            size={20}
            className={cn(
              'transition-colors',
              isActive ? 'text-[#1e1b4b]' : 'text-[#6b7280]'
            )}
          />

          {/* Badge */}
          {badge != null && badge > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f43f5e] px-1 text-[9px] font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            >
              {badge > 99 ? '99+' : badge}
            </motion.span>
          )}
        </motion.div>

        {/* Label */}
        <motion.span
          className={cn(
            'text-[10px] font-medium leading-none',
            isActive ? 'text-[#7c3aed]' : 'text-[#9ca3af]'
          )}
          animate={{ opacity: 1 }}
        >
          {label}
        </motion.span>
      </Link>
    </motion.div>
  )
}

// Gentle floating animation for the whole dock
const floatVariants = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

function FloatingDock({ pendingRequests = 0 }: FloatingDockProps) {
  const pathname = usePathname()

  const badges: Record<string, number> = {
    pendingRequests,
  }

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      variants={floatVariants}
      animate="animate"
    >
      <motion.nav
        className={cn(
          'flex items-center gap-1 rounded-full px-3 py-2',
          'bg-white/80 backdrop-blur-[20px]',
          'border border-[rgba(196,181,253,0.3)]',
          'shadow-[0_8px_32px_rgba(196,181,253,0.35),0_2px_8px_rgba(196,181,253,0.2)]'
        )}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.1 }}
      >
        {DOCK_ITEMS.map(({ href, icon, label, badgeKey }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          const badge = badgeKey ? badges[badgeKey] : undefined

          return (
            <DockItem
              key={href}
              href={href as string}
              icon={icon}
              label={label}
              isActive={isActive}
              badge={badge}
            />
          )
        })}
      </motion.nav>
    </motion.div>
  )
}

export { FloatingDock }
