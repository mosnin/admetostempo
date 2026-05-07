'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, Share2, X, CheckCircle, ExternalLink } from 'lucide-react'
import { formatAmount, formatDate, truncateAddress } from '@/lib/utils'

interface TransactionReceiptProps {
  transaction: {
    id: string
    amount: number
    currency: string
    memo?: string | null
    tx_hash?: string | null
    from_address: string
    to_address: string
    status: string
    created_at: string
    from_profile?: { username: string; display_name: string }
    to_profile?: { username: string; display_name: string }
  }
  onClose: () => void
}

export function TransactionReceipt({ transaction, onClose }: TransactionReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  async function downloadReceipt() {
    // Use browser print for PDF-like download
    const content = receiptRef.current
    if (!content) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <html>
        <head>
          <title>Admetos Receipt - ${transaction.id.slice(0, 8)}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; max-width: 400px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: 900; background: linear-gradient(135deg, #8B5CF6, #10B981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .amount { font-size: 48px; font-weight: 900; color: #111827; text-align: center; margin: 20px 0; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
            .label { color: #6b7280; } .value { color: #111827; font-weight: 600; }
            .status { text-align: center; padding: 8px 20px; background: #d1fae5; color: #065f46; border-radius: 20px; display: inline-block; font-weight: 700; margin: 10px auto; }
            .footer { text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px; }
            .hash { font-family: monospace; font-size: 11px; word-break: break-all; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header"><div class="logo">admetos</div><p style="color:#6b7280;font-size:13px">Payment Receipt</p></div>
          <div class="amount">${formatAmount(transaction.amount)}</div>
          <div style="text-align:center"><span class="status">✓ ${transaction.status}</span></div>
          <div style="margin-top:20px">
            <div class="row"><span class="label">From</span><span class="value">${transaction.from_profile ? `@${transaction.from_profile.username}` : truncateAddress(transaction.from_address)}</span></div>
            <div class="row"><span class="label">To</span><span class="value">${transaction.to_profile ? `@${transaction.to_profile.username}` : truncateAddress(transaction.to_address)}</span></div>
            <div class="row"><span class="label">Currency</span><span class="value">${transaction.currency}</span></div>
            ${transaction.memo ? `<div class="row"><span class="label">Memo</span><span class="value">${transaction.memo}</span></div>` : ''}
            <div class="row"><span class="label">Date</span><span class="value">${formatDate(transaction.created_at)}</span></div>
            <div class="row"><span class="label">Receipt ID</span><span class="value">${transaction.id.slice(0, 8).toUpperCase()}</span></div>
            ${transaction.tx_hash ? `<div style="margin-top:10px"><p class="label" style="font-size:12px;margin-bottom:4px">Transaction Hash</p><p class="hash">${transaction.tx_hash}</p></div>` : ''}
          </div>
          <div class="footer">Admetos · Powered by Tempo blockchain<br/>admetos.xyz</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  async function shareReceipt() {
    const text = `I sent ${formatAmount(transaction.amount)} ${transaction.currency} on Admetos${transaction.memo ? ` — ${transaction.memo}` : ''}`
    if (navigator.share) {
      await navigator.share({ title: 'Admetos Payment Receipt', text, url: `https://admetos.xyz/history` })
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        ref={receiptRef}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-violet-500 to-emerald-500 p-6 text-center text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
            <X size={14} />
          </button>
          <p className="font-black text-lg tracking-tight">admetos</p>
          <CheckCircle size={40} className="mx-auto my-3" />
          <p className="text-4xl font-black">{formatAmount(transaction.amount)}</p>
          <p className="text-white/80 text-sm mt-1">{transaction.currency}</p>
        </div>

        {/* Details */}
        <div className="p-5 space-y-3">
          {[
            { label: 'From', value: transaction.from_profile ? `@${transaction.from_profile.username}` : truncateAddress(transaction.from_address, 6) },
            { label: 'To', value: transaction.to_profile ? `@${transaction.to_profile.username}` : truncateAddress(transaction.to_address, 6) },
            transaction.memo ? { label: 'Memo', value: transaction.memo } : null,
            { label: 'Date', value: formatDate(transaction.created_at) },
            { label: 'Status', value: transaction.status, accent: true },
            { label: 'Receipt', value: `#${transaction.id.slice(0, 8).toUpperCase()}` },
          ].filter(Boolean).map(row => (
            <div key={row!.label} className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{row!.label}</span>
              <span className={row!.accent ? 'text-emerald-600 font-bold capitalize' : 'font-semibold text-slate-700'}>{row!.value}</span>
            </div>
          ))}

          {transaction.tx_hash && (
            <a
              href={`${process.env.NEXT_PUBLIC_TEMPO_EXPLORER_URL || 'https://explorer.testnet.tempo.xyz'}/tx/${transaction.tx_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-violet-500 hover:underline"
            >
              View on Explorer <ExternalLink size={10} />
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 grid grid-cols-2 gap-3">
          <button onClick={downloadReceipt} className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors">
            <Download size={16} /> Download
          </button>
          <button onClick={shareReceipt} className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-violet-500 hover:bg-violet-600 text-white font-semibold text-sm transition-colors">
            <Share2 size={16} /> Share
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
