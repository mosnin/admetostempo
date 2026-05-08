'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Confetti } from './Confetti'

interface SuccessAnimationProps {
  show: boolean
  amount?: string
  recipient?: string
  txHash?: string
  onDone?: () => void
}

export function SuccessAnimation({ show, amount, recipient, txHash, onDone }: SuccessAnimationProps) {
  return (
    <>
      <Confetti active={show} />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: show ? 1 : 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="flex flex-col items-center gap-4 py-8"
      >
        <motion.div
          animate={show ? { scale: [0, 1.2, 1] } : {}}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200"
        >
          <Check className="w-10 h-10 text-white stroke-[3]" />
        </motion.div>
        {amount && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
            <div className="text-3xl font-black text-gray-900">{amount}</div>
            {recipient && <div className="text-gray-500 mt-1">sent to <span className="font-semibold text-gray-700">@{recipient}</span></div>}
          </motion.div>
        )}
        {txHash && (
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            href={`${process.env.NEXT_PUBLIC_TEMPO_EXPLORER_URL || 'https://explorer.testnet.tempo.xyz'}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-violet-500 hover:underline font-mono"
          >
            View on Explorer →
          </motion.a>
        )}
        {onDone && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={onDone}
            className="mt-2 px-6 py-2.5 bg-gradient-to-r from-violet-500 to-emerald-500 text-white rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Done
          </motion.button>
        )}
      </motion.div>
    </>
  )
}
