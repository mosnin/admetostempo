'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Copy, Check } from 'lucide-react'

export function ShareButton({ url, title, text, className = '' }: {
  url: string; title?: string; text?: string; className?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: title || 'Admetos', text: text || 'Pay me on Admetos', url })
        return
      } catch {}
    }
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 hover:bg-white border border-slate-200 hover:border-violet-300 text-slate-600 hover:text-violet-600 text-sm font-medium transition-all ${className}`}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-emerald-500">
            <Check size={16} />
          </motion.span>
        ) : (
          <motion.span key="share" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            {navigator?.share ? <Share2 size={16} /> : <Copy size={16} />}
          </motion.span>
        )}
      </AnimatePresence>
      {copied ? 'Copied!' : 'Share'}
    </button>
  )
}
