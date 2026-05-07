'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { RecipientSearch } from './RecipientSearch'
import { AmountInput } from './AmountInput'
import type { Profile } from '@/types'

interface RequestFormProps {
  defaultUsername?: string
  onSuccess?: () => void
}

const pageVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
}

export function RequestForm({ defaultUsername = '', onSuccess }: RequestFormProps) {
  const [step, setStep] = useState(0)
  const [recipientInput, setRecipientInput] = useState(defaultUsername ? `@${defaultUsername}` : '')
  const [recipientProfile, setRecipientProfile] = useState<Profile | null>(null)
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<import('./StablecoinSelector').StablecoinSymbol>('pathUSD')
  const [memo, setMemo] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canProceedStep0 = !!recipientProfile
  const canProceedStep1 = parseFloat(amount) > 0
  const canProceedStep2 = memo.trim().length > 0

  function getInitials(name?: string | null) {
    if (!name) return '?'
    return name.slice(0, 2).toUpperCase()
  }

  async function handleRequest() {
    if (!recipientProfile) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/payments/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUsername: recipientProfile.username,
          amount,
          currency,
          memo,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setDone(true)
      toast.success(`Request sent to ${recipientProfile.display_name || recipientProfile.username}!`)
      onSuccess?.()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Request failed'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4 py-4"
      >
        <div
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #a7f3d0, #fed7aa)' }}
        >
          <CheckCircle size={32} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lavender-800">Request sent!</h3>
          <p className="text-lavender-500 text-sm mt-1">
            Requested ${parseFloat(amount).toFixed(2)} {currency} from{' '}
            {recipientProfile?.display_name || recipientProfile?.username}
          </p>
        </div>
        <button
          onClick={() => {
            setStep(0); setDone(false); setRecipientInput(''); setRecipientProfile(null)
            setAmount(''); setMemo(''); setError(null)
          }}
          className="px-6 py-2.5 rounded-xl font-semibold text-white text-sm"
          style={{ background: 'linear-gradient(135deg, #a7f3d0, #fed7aa)' }}
        >
          New request
        </button>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {step === 0 && (
        <motion.div key="req0" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
          <RecipientSearch
            value={recipientInput}
            onChange={setRecipientInput}
            onSelectProfile={setRecipientProfile}
            onExternalMode={() => {}}
            placeholder="@username"
          />
          <button
            disabled={!canProceedStep0}
            onClick={() => setStep(1)}
            className="w-full py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #a7f3d0, #fed7aa)' }}
          >
            Next <ArrowRight size={18} />
          </button>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div key="req1" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(0)} className="p-2 rounded-xl hover:bg-lavender-100 text-lavender-600">
              <ArrowLeft size={20} />
            </button>
            <p className="font-semibold text-lavender-700">Requesting from <span className="text-lavender-900">{recipientProfile?.display_name || recipientProfile?.username}</span></p>
          </div>
          <div className="glass rounded-3xl p-8 flex flex-col items-center">
            <AmountInput value={amount} coin={currency} onChange={setAmount} onCoinChange={setCurrency} />
          </div>
          <button
            disabled={!canProceedStep1}
            onClick={() => setStep(2)}
            className="w-full py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #a7f3d0, #fed7aa)' }}
          >
            Next <ArrowRight size={18} />
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div key="req2" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(1)} className="p-2 rounded-xl hover:bg-lavender-100 text-lavender-600">
              <ArrowLeft size={20} />
            </button>
            <h2 className="font-bold text-lavender-800">What&apos;s it for?</h2>
          </div>
          <textarea
            value={memo}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMemo(e.target.value)}
            placeholder="Dinner, concert tickets... (required)"
            rows={3}
            className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-lavender-300 text-lavender-800 placeholder:text-lavender-300 resize-none"
          />
          <p className="text-xs text-lavender-400">A memo is required for payment requests.</p>

          {/* Review summary */}
          <div className="glass rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #a7f3d0, #fed7aa)' }}
              >
                {recipientProfile?.avatar_url ? (
                  <img src={recipientProfile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : getInitials(recipientProfile?.display_name || recipientProfile?.username)}
              </div>
              <div>
                <p className="font-semibold text-lavender-800">{recipientProfile?.display_name || recipientProfile?.username}</p>
                <p className="text-sm text-lavender-500">${parseFloat(amount || '0').toFixed(2)} {currency}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">{error}</div>
          )}

          <button
            disabled={!canProceedStep2 || loading}
            onClick={handleRequest}
            className="w-full py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #a7f3d0, #fed7aa)' }}
          >
            {loading ? <span className="animate-pulse">Sending...</span> : 'Send Request'}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
