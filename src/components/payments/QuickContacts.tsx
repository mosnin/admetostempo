'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'

interface Contact {
  profile_id: string
  username: string
  display_name: string
  avatar_url: string | null
  last_paid_at: string
  total_paid: number
}

interface QuickContactsProps {
  onSelect: (username: string) => void
}

export function QuickContacts({ onSelect }: QuickContactsProps) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/payments/recent-contacts')
      .then(r => r.json())
      .then(data => setContacts(data.contacts || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && contacts.length === 0) return null

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <Skeleton variant="circle" width={56} height={56} />
              <Skeleton variant="text" className="h-3 w-12" />
            </div>
          ))
        ) : (
          contacts.map((contact, i) => (
            <motion.button
              key={contact.profile_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelect(contact.username)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
            >
              <div className="relative">
                <Avatar
                  src={contact.avatar_url || undefined}
                  name={contact.display_name}
                  size="lg"
                  className="ring-2 ring-white shadow-md group-hover:ring-violet-300 transition-all"
                />
              </div>
              <span className="text-xs text-gray-600 font-medium truncate w-14 text-center">
                @{contact.username}
              </span>
            </motion.button>
          ))
        )}
      </div>
    </div>
  )
}
