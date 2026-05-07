'use client'
import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function BusinessProfileError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="min-h-[60vh] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #d1fae5 50%, #ffedd5 100%)' }}>
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 max-w-sm mx-4 text-center shadow-xl">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Couldn't load business profile</h2>
        <p className="text-slate-500 text-sm mb-6">{error.message || 'An unexpected error occurred'}</p>
        <Button onClick={reset} variant="primary">Try again</Button>
      </div>
    </div>
  )
}
