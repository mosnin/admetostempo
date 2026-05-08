'use client'
import { useEffect, useState } from 'react'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  avatar?: string
  username?: string
  amount?: number
  read: boolean
  created_at: string
  href: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(({ notifications: n, unreadCount: c }) => {
        setNotifications(n || [])
        setUnreadCount(c || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  function dismiss(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  return { notifications, unreadCount, loading, markAllRead, dismiss }
}
