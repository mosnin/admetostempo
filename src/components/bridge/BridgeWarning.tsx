'use client'

import { AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

interface BridgeWarningProps {
  understood: boolean
  onUnderstoodChange: (checked: boolean) => void
}

export function BridgeWarning({ understood, onUnderstoodChange }: BridgeWarningProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="rounded-2xl border border-peach-200 bg-gradient-to-br from-peach-50 to-peach-100/60 p-4"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-xl bg-peach-200 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle size={16} className="text-peach-600" />
        </div>
        <div>
          <p className="font-bold text-peach-800 text-sm mb-1">Important: Read Before Bridging</p>
          <ul className="space-y-1 text-xs text-peach-700">
            <li className="flex items-start gap-1.5">
              <span className="shrink-0 mt-0.5">•</span>
              <span>Bridge transactions are <strong>IRREVERSIBLE</strong>. There is no undo.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="shrink-0 mt-0.5">•</span>
              <span>Funds will be sent to the <strong>same address</strong> on the destination chain.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="shrink-0 mt-0.5">•</span>
              <span>This process typically takes <strong>30–90 seconds</strong>. Do not close this window.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="shrink-0 mt-0.5">•</span>
              <span>Network congestion may cause delays. Never bridge more than you can afford to lose.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Checkbox */}
      <label className="flex items-center gap-3 cursor-pointer group mt-3 pt-3 border-t border-peach-200">
        <div className="relative">
          <input
            type="checkbox"
            checked={understood}
            onChange={(e) => onUnderstoodChange(e.target.checked)}
            className="sr-only"
          />
          <motion.div
            animate={{
              backgroundColor: understood ? '#fb923c' : 'rgba(255,255,255,0.9)',
              borderColor: understood ? '#fb923c' : '#fdba74',
            }}
            transition={{ duration: 0.15 }}
            className="w-5 h-5 rounded-md border-2 flex items-center justify-center"
          >
            {understood && (
              <motion.svg
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                viewBox="0 0 12 12"
                fill="none"
                className="w-3 h-3"
              >
                <path
                  d="M2 6l3 3 5-5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </motion.div>
        </div>
        <span className="text-sm font-semibold text-peach-800 group-hover:text-peach-900 transition-colors">
          I understand the risks and want to proceed
        </span>
      </label>
    </motion.div>
  )
}
