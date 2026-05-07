'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, Wallet, X } from 'lucide-react'
import type { Profile } from '@/types'

interface RecipientSearchProps {
  value: string
  onChange: (value: string) => void
  onSelectProfile: (profile: Profile | null) => void
  onExternalMode: (isExternal: boolean, address: string) => void
  placeholder?: string
}

function isEthAddress(val: string) {
  return /^0x[0-9a-fA-F]{40}$/.test(val)
}

export function RecipientSearch({
  value,
  onChange,
  onSelectProfile,
  onExternalMode,
  placeholder = '@username or 0x address',
}: RecipientSearchProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [searching, setSearching] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [isExternal, setIsExternal] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const cleaned = value.replace(/^@/, '').trim()

    if (!cleaned) {
      setProfile(null)
      setNotFound(false)
      setIsExternal(false)
      onSelectProfile(null)
      onExternalMode(false, '')
      return
    }

    if (isEthAddress(cleaned)) {
      setProfile(null)
      setNotFound(false)
      setIsExternal(true)
      onSelectProfile(null)
      onExternalMode(true, cleaned)
      return
    }

    setIsExternal(false)
    onExternalMode(false, '')

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setSearching(true)
      setNotFound(false)
      try {
        const res = await fetch(`/api/profile/${cleaned}`)
        if (res.ok) {
          const data = await res.json()
          const p = data.profile || data
          setProfile(p)
          onSelectProfile(p)
          setNotFound(false)
        } else {
          setProfile(null)
          onSelectProfile(null)
          setNotFound(true)
        }
      } catch {
        setProfile(null)
        onSelectProfile(null)
        setNotFound(true)
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  function clear() {
    onChange('')
    setProfile(null)
    setNotFound(false)
    setIsExternal(false)
    onSelectProfile(null)
    onExternalMode(false, '')
  }

  const initials = profile
    ? (profile.display_name || profile.username || '?').slice(0, 2).toUpperCase()
    : ''

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-lavender-400"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-lavender-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-lavender-300 text-lavender-800 placeholder:text-lavender-300"
        />
        {value && (
          <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-lavender-400 hover:text-lavender-600">
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {searching && (
          <motion.div
            key="searching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl glass"
          >
            <div className="w-10 h-10 rounded-full shimmer" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 rounded-full shimmer w-32" />
              <div className="h-3 rounded-full shimmer w-20" />
            </div>
          </motion.div>
        )}

        {!searching && profile && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl glass border border-mint-200/40"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #c4b5fd, #a7f3d0)' }}
            >
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={initials} className="w-10 h-10 rounded-full object-cover" />
              ) : initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-lavender-800 truncate">{profile.display_name || profile.username}</p>
              <p className="text-sm text-lavender-500">@{profile.username}</p>
            </div>
            <User size={16} className="text-mint-500 flex-shrink-0" />
          </motion.div>
        )}

        {!searching && isExternal && (
          <motion.div
            key="external"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-peach-50/80 border border-peach-200"
          >
            <Wallet size={20} className="text-peach-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-peach-700 text-sm">External address</p>
              <p className="text-xs text-peach-500 font-mono truncate">{value}</p>
            </div>
          </motion.div>
        )}

        {!searching && notFound && value.length > 1 && (
          <motion.div
            key="notfound"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-500 text-sm text-center"
          >
            No user found for &quot;{value.replace(/^@/, '')}&quot;
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
