'use client'
import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function WalletError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 max-w-sm mx-4 text-center shadow-xl">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Couldn't load wallet</h2>
        <p className="text-slate-500 text-sm mb-6">{error.message || 'An unexpected error occurred'}</p>
        <Button onClick={reset} variant="primary">Try again</Button>
      </div>
    </div>
  )
}
