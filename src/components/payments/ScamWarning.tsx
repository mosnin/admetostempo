'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, ShieldAlert } from 'lucide-react'

interface ScamWarningProps {
  address: string
  confirmed: boolean
  onConfirm: (checked: boolean) => void
}

export function ScamWarning({ address, confirmed, onConfirm }: ScamWarningProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl border-2 border-amber-400/60 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)' }}
    >
      {/* Header stripe */}
      <div className="flex items-center gap-3 px-5 py-4 bg-amber-400/20 border-b border-amber-300/40">
        <AlertTriangle size={22} className="text-amber-600 flex-shrink-0" />
        <p className="font-bold text-amber-800 text-sm uppercase tracking-wide">External transfer warning</p>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex gap-3">
          <ShieldAlert size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-amber-900">
              You are about to send to an external wallet address. Admetos cannot help recover these funds.
            </p>
            <p className="text-amber-700">
              Watch out for scams — <strong>never send money</strong> if someone pressured you to, promised unrealistic returns, or claimed this is an "urgent" transfer. Legitimate services will never ask you to send crypto unexpectedly.
            </p>
          </div>
        </div>

        {/* Address display */}
        <div className="rounded-xl bg-amber-100/70 border border-amber-200 px-4 py-3">
          <p className="text-xs text-amber-600 mb-1 font-medium">Sending to address</p>
          <p className="font-mono text-xs text-amber-800 break-all">{address}</p>
        </div>

        {/* Confirmation checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConfirm(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                confirmed
                  ? 'bg-amber-500 border-amber-500'
                  : 'bg-white border-amber-400 group-hover:border-amber-500'
              }`}
            >
              {confirmed && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <p className="text-sm text-amber-800 font-medium leading-snug">
            I understand this transfer is irreversible and Admetos cannot recover my funds if I send to the wrong address or am being scammed.
          </p>
        </label>
      </div>
    </motion.div>
  )
}
