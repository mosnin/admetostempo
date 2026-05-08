'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const REACTIONS = ['👍', '❤️', '😂', '🙏', '🔥', '💸']

interface Reaction {
  emoji: string
  count: number
  reacted: boolean
}

interface EmojiReactionsProps {
  messageId: string
  reactions?: Reaction[]
  onReact: (emoji: string, messageId: string) => void
}

export function EmojiReactions({ messageId, reactions = [], onReact }: EmojiReactionsProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [localReactions, setLocalReactions] = useState<Reaction[]>(reactions)

  function handleReact(emoji: string) {
    setLocalReactions(prev => {
      const existing = prev.find(r => r.emoji === emoji)
      if (existing) {
        return prev.map(r => r.emoji === emoji ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted } : r)
      }
      return [...prev, { emoji, count: 1, reacted: true }]
    })
    onReact(emoji, messageId)
    setShowPicker(false)
  }

  const activeReactions = localReactions.filter(r => r.count > 0)

  return (
    <div className="relative">
      {/* Existing reactions */}
      {activeReactions.length > 0 && (
        <div className="flex gap-1 mt-1">
          {activeReactions.map(r => (
            <motion.button
              key={r.emoji}
              whileTap={{ scale: 0.85 }}
              onClick={() => handleReact(r.emoji)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all ${
                r.reacted
                  ? 'bg-violet-100 border-2 border-violet-300 text-violet-700'
                  : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-white'
              }`}
            >
              {r.emoji} <span className="font-semibold">{r.count}</span>
            </motion.button>
          ))}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowPicker(p => !p)}
            className="px-2 py-0.5 rounded-full text-xs bg-white/80 border border-slate-200 text-slate-400 hover:bg-white transition-all"
          >
            +
          </motion.button>
        </div>
      )}

      {/* Add reaction button (shows on hover) */}
      {activeReactions.length === 0 && (
        <button
          onClick={() => setShowPicker(p => !p)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-slate-500 text-xs mt-0.5"
        >
          😊
        </button>
      )}

      {/* Emoji picker */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute bottom-full mb-1 left-0 flex gap-1 bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-white/60 z-10"
          >
            {REACTIONS.map(emoji => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.3, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleReact(emoji)}
                className="text-xl w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
              >
                {emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
