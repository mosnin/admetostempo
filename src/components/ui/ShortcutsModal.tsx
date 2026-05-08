'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Command } from 'lucide-react'

const SHORTCUTS = [
  { keys: ['⌘', 'K'], description: 'Open command palette', category: 'Navigation' },
  { keys: ['⌘', 'S'], description: 'Send payment', category: 'Navigation' },
  { keys: ['⌘', 'R'], description: 'Request money', category: 'Navigation' },
  { keys: ['⌘', 'B'], description: 'Open bridge', category: 'Navigation' },
  { keys: ['⌘', 'E'], description: 'Explore businesses', category: 'Navigation' },
  { keys: ['?'], description: 'Show this help', category: 'Help' },
  { keys: ['Esc'], description: 'Close modal / dialog', category: 'UI' },
  { keys: ['↵'], description: 'Confirm / submit', category: 'UI' },
  { keys: ['↑', '↓'], description: 'Navigate list items', category: 'UI' },
]

export function ShortcutsModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      if (e.key === '?') setOpen(true)
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const categories = [...new Set(SHORTCUTS.map(s => s.category))]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-md shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Command size={20} className="text-violet-500" />
                <h2 className="font-bold text-slate-800">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            {categories.map(cat => (
              <div key={cat} className="mb-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{cat}</h3>
                <div className="space-y-1">
                  {SHORTCUTS.filter(s => s.category === cat).map(({ keys, description }) => (
                    <div key={description} className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-slate-600">{description}</span>
                      <div className="flex items-center gap-1">
                        {keys.map(k => (
                          <kbd key={k} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 shadow-sm">{k}</kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-xs text-slate-400 mt-4 text-center">
              Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono">?</kbd> to show this anywhere
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
