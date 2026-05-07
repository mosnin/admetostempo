'use client'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { SendForm } from '@/components/payments'

function SendPageInner() {
  const params = useSearchParams()
  const defaultTo = params.get('to') || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-lavender-800">Send</h1>
        <p className="text-sm text-lavender-500 mt-0.5">Send stablecoins on Tempo Blockchain</p>
      </div>

      <div className="glass rounded-3xl p-6">
        <SendForm defaultUsername={defaultTo} />
      </div>
    </motion.div>
  )
}

export default function SendPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="h-8 rounded-xl shimmer w-24" />
          <div className="h-64 rounded-3xl shimmer" />
        </div>
      }
    >
      <SendPageInner />
    </Suspense>
  )
}
