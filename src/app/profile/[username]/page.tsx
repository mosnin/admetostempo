'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Copy, Check, ArrowLeft, Edit2, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'

interface ProfileData {
  userId: string
  displayName: string
  username: string
  bio?: string
  avatarUrl?: string
  walletAddress?: string
  isCurrentUser?: boolean
}

interface PublicTransaction {
  id: string
  direction: 'in' | 'out'
  amount: string
  memo?: string
  created_at: string
}

function AddressCopy({ address }: { address: string }) {
  const [copied, setCopied] = React.useState(false)
  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`

  function handleCopy() {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#f5f3ff] border border-[#e8e4fd] text-sm font-mono text-[#6b7280] hover:bg-[#ede9fe] transition-colors group"
    >
      <span>{truncated}</span>
      {copied ? (
        <Check size={14} className="text-[#10b981]" />
      ) : (
        <Copy size={14} className="text-[#a78bfa] group-hover:text-[#7c3aed] transition-colors" />
      )}
    </button>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white/70 border border-[rgba(196,181,253,0.2)] p-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <Skeleton variant="circle" width={96} height={96} />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="25%" />
          <Skeleton variant="text" lines={2} width="70%" />
          <Skeleton variant="rect" height={44} className="rounded-2xl w-full" />
          <Skeleton variant="rect" height={44} className="rounded-2xl w-full" />
        </div>
      </div>
    </div>
  )
}

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const username = params?.username as string

  const [profile, setProfile] = React.useState<ProfileData | null>(null)
  const [transactions, setTransactions] = React.useState<PublicTransaction[]>([])
  const [loading, setLoading] = React.useState(true)
  const [notFound, setNotFound] = React.useState(false)

  React.useEffect(() => {
    if (!username) return
    setLoading(true)
    Promise.all([
      fetch(`/api/users/${username}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/users/${username}/transactions`).then((r) =>
        r.ok ? r.json() : { transactions: [] }
      ),
    ])
      .then(([profileData, txData]) => {
        if (!profileData) {
          setNotFound(true)
        } else {
          setProfile(profileData.user ?? profileData)
          setTransactions(txData.transactions ?? [])
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [username])

  if (loading) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#7c3aed] font-medium"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <ProfileSkeleton />
      </div>
    )
  }

  if (notFound || !profile) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">👤</p>
        <h2 className="text-xl font-bold text-[#1e1b4b] mb-2">User Not Found</h2>
        <p className="text-[#6b7280] text-sm mb-6">@{username} doesn't exist on Admetos.</p>
        <Button variant="ghost" onClick={() => router.push('/explore')}>
          Explore Users
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <motion.button
        type="button"
        onClick={() => router.back()}
        whileHover={{ x: -2 }}
        className="flex items-center gap-2 text-sm text-[#7c3aed] font-medium"
      >
        <ArrowLeft size={16} /> Back
      </motion.button>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="rounded-2xl bg-white/70 backdrop-blur-sm border border-[rgba(196,181,253,0.2)] shadow-[0_4px_24px_rgba(196,181,253,0.18)] p-6"
      >
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="mb-4">
            <Avatar
              src={profile.avatarUrl}
              name={profile.displayName}
              size="2xl"
              className="ring-4 ring-white shadow-[0_4px_16px_rgba(196,181,253,0.35)]"
            />
          </div>

          {/* Name & username */}
          <h1 className="text-2xl font-bold text-[#1e1b4b] mb-0.5">{profile.displayName}</h1>
          <p className="text-[#7c3aed] font-medium mb-3">@{profile.username}</p>

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-[#6b7280] mb-4 max-w-xs">{profile.bio}</p>
          )}

          {/* Wallet address */}
          {profile.walletAddress && (
            <div className="mb-5">
              <p className="text-xs text-[#9ca3af] mb-1.5">Wallet Address</p>
              <AddressCopy address={profile.walletAddress} />
            </div>
          )}

          {/* Action buttons */}
          <div className="w-full space-y-3">
            {profile.isCurrentUser ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                leftIcon={<Edit2 size={16} />}
                onClick={() => router.push('/profile')}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    const p = new URLSearchParams({ to: profile.username })
                    router.push(`/send?${p}`)
                  }}
                >
                  Pay {profile.displayName}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    const p = new URLSearchParams({ from: profile.username })
                    router.push(`/request?${p}`)
                  }}
                >
                  Request from {profile.displayName}
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Recent public transactions */}
      {transactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.08 }}
        >
          <h2 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider mb-3">
            Recent Activity
          </h2>
          <div className="rounded-2xl bg-white/70 border border-[rgba(196,181,253,0.2)] divide-y divide-[#f3f0ff] overflow-hidden">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                <div
                  className={[
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    tx.direction === 'in'
                      ? 'bg-[#d1fae5] text-[#10b981]'
                      : 'bg-[#ede9fe] text-[#7c3aed]',
                  ].join(' ')}
                >
                  {tx.direction === 'in' ? (
                    <ArrowDownLeft size={14} />
                  ) : (
                    <ArrowUpRight size={14} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1e1b4b] truncate">
                    {tx.memo || (tx.direction === 'in' ? 'Received' : 'Sent')}
                  </p>
                  <p className="text-xs text-[#9ca3af]">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={[
                    'text-sm font-bold',
                    tx.direction === 'in' ? 'text-[#10b981]' : 'text-[#6b7280]',
                  ].join(' ')}
                >
                  {tx.direction === 'in' ? '+' : '-'}${tx.amount}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
