'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Wifi, AlertTriangle } from 'lucide-react'

type NetworkState = 'online' | 'offline' | 'slow'

export function NetworkStatus() {
  const [status, setStatus] = useState<NetworkState>('online')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleOnline() {
      setStatus('online')
      setVisible(true)
      setTimeout(() => setVisible(false), 3000)
    }
    function handleOffline() {
      setStatus('offline')
      setVisible(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    if (!navigator.onLine) {
      setStatus('offline')
      setVisible(true)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const configs = {
    online: { bg: 'bg-emerald-500', icon: Wifi, text: 'Back online' },
    offline: { bg: 'bg-rose-500', icon: WifiOff, text: 'No internet connection' },
    slow: { bg: 'bg-amber-500', icon: AlertTriangle, text: 'Slow connection detected' },
  }

  const { bg, icon: Icon, text } = configs[status]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className={`fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2 rounded-full ${bg} text-white text-sm font-semibold shadow-lg`}
        >
          <Icon size={14} />
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
