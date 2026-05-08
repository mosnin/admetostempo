'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 via-emerald-50 to-orange-50 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-6 text-sm">{error.message || 'An unexpected error occurred. Please try again.'}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="primary">Try again</Button>
          <Button onClick={() => window.location.href = '/dashboard'} variant="secondary">Go home</Button>
        </div>
        {error.digest && <p className="text-xs text-gray-400 mt-4">Error ID: {error.digest}</p>}
      </motion.div>
    </div>
  )
}
