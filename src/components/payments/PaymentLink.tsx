'use client'
import { useState } from 'react'
import { QRCode } from '@/components/ui/QRCode'
import { ShareButton } from '@/components/ui/ShareButton'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, ChevronDown } from 'lucide-react'

export function PaymentLink({ username, walletAddress, defaultAmount }: {
  username: string; walletAddress: string; defaultAmount?: string
}) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(defaultAmount || '')

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://admetos.xyz'
  const payUrl = amount
    ? `${baseUrl}/pay/@${username}?amount=${amount}`
    : `${baseUrl}/pay/@${username}`

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-100 flex items-center justify-center">
            <QrCode size={20} className="text-violet-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Payment link & QR</p>
            <p className="text-xs text-slate-500">Share to receive money</p>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown size={20} className="text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Amount (optional)"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
                <ShareButton url={payUrl} title={`Pay @${username}`} text={`Send me money on Admetos`} />
              </div>
              <div className="flex justify-center">
                <QRCode value={payUrl} size={180} />
              </div>
              <p className="text-xs text-slate-400 text-center break-all">{payUrl}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
