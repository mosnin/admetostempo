'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { RecipientSearch } from './RecipientSearch'
import { AmountInput } from './AmountInput'
import { AmountPresets } from './AmountPresets'
import { MemoSuggestions } from './MemoSuggestions'
import { ScamWarning } from './ScamWarning'
import { SuccessAnimation } from '@/components/ui/SuccessAnimation'
import type { Profile } from '@/types'

const STEP_LABELS = ['Recipient', 'Amount', 'Memo', 'Confirm', 'Done']

interface SendFormProps {
  defaultUsername?: string
}

export function SendForm({ defaultUsername = '' }: SendFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)

  // Recipient
  const [recipientInput, setRecipientInput] = useState(defaultUsername ? `@${defaultUsername}` : '')
  const [recipientProfile, setRecipientProfile] = useState<Profile | null>(null)
  const [isExternal, setIsExternal] = useState(false)
  const [externalAddress, setExternalAddress] = useState('')
  const [scamConfirmed, setScamConfirmed] = useState(false)

  // Amount
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('pathUSD')

  // Memo
  const [memo, setMemo] = useState('')

  // Result
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [txError, setTxError] = useState<string | null>(null)

  const canProceedStep0 = !!(recipientProfile || (isExternal && externalAddress && scamConfirmed))
  const canProceedStep1 = parseFloat(amount) > 0

  function getInitials(name?: string | null) {
    if (!name) return '?'
    return name.slice(0, 2).toUpperCase()
  }

  function displayName() {
    if (recipientProfile) return recipientProfile.display_name || recipientProfile.username
    if (isExternal) return `${externalAddress.slice(0, 8)}...${externalAddress.slice(-6)}`
    return ''
  }

  async function handleSend() {
    setLoading(true)
    setTxError(null)
    try {
      const body: Record<string, string> = {
        amount,
        currency,
        memo,
      }
      if (recipientProfile) {
        body.recipientUsername = recipientProfile.username
      } else if (isExternal) {
        body.recipientAddress = externalAddress
      }

      const res = await fetch('/api/payments/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Payment failed')

      setTxHash(data.tx_hash || data.txHash || null)
      setStep(4)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment failed'
      setTxError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  function formatAmount(amt: string) {
    return `$${parseFloat(amt || '0').toFixed(2)} ${currency}`
  }

  const pageVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      {step < 4 && (
        <div className="flex gap-1.5 justify-center">
          {STEP_LABELS.slice(0, 4).map((label, i) => (
            <div
              key={label}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-lavender-400' : i < step ? 'w-4 bg-lavender-300' : 'w-4 bg-lavender-200'
              }`}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Step 0: Recipient */}
        {step === 0 && (
          <motion.div key="step0" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
            <h2 className="text-xl font-bold text-lavender-800">Who are you paying?</h2>
            <RecipientSearch
              value={recipientInput}
              onChange={setRecipientInput}
              onSelectProfile={setRecipientProfile}
              onExternalMode={(ext, addr) => { setIsExternal(ext); setExternalAddress(addr) }}
            />
            {isExternal && externalAddress && (
              <ScamWarning address={externalAddress} confirmed={scamConfirmed} onConfirm={setScamConfirmed} />
            )}
            <button
              disabled={!canProceedStep0}
              onClick={() => setStep(1)}
              className="w-full py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              style={{ background: 'linear-gradient(135deg, #c4b5fd, #a7f3d0)' }}
            >
              Next <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {/* Step 1: Amount */}
        {step === 1 && (
          <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setStep(0)} className="p-2 rounded-xl hover:bg-lavender-100 text-lavender-600">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-bold text-lavender-800">How much?</h2>
            </div>
            <AmountPresets onSelect={setAmount} selected={amount} />
            <div className="glass rounded-3xl p-8 flex flex-col items-center">
              <AmountInput amount={amount} currency={currency} onChange={setAmount} onCurrencyChange={setCurrency} />
            </div>
            <button
              disabled={!canProceedStep1}
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #c4b5fd, #a7f3d0)' }}
            >
              Next <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {/* Step 2: Memo */}
        {step === 2 && (
          <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setStep(1)} className="p-2 rounded-xl hover:bg-lavender-100 text-lavender-600">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-bold text-lavender-800">What&apos;s it for?</h2>
            </div>
            <textarea
              value={memo}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMemo(e.target.value)}
              placeholder="Coffee, rent, concert tickets... (optional)"
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-lavender-300 text-lavender-800 placeholder:text-lavender-300 resize-none"
            />
            <MemoSuggestions onSelect={setMemo} />
            <p className="text-xs text-lavender-400">Memos are stored on-chain via TIP-20 and are publicly visible.</p>
            <button
              onClick={() => setStep(3)}
              className="w-full py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #c4b5fd, #a7f3d0)' }}
            >
              Review <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <motion.div key="step3" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setStep(2)} className="p-2 rounded-xl hover:bg-lavender-100 text-lavender-600">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-bold text-lavender-800">Review & Send</h2>
            </div>

            <div className="glass rounded-3xl p-6 space-y-4">
              {/* Recipient */}
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: 'linear-gradient(135deg, #c4b5fd, #a7f3d0)' }}
                >
                  {recipientProfile?.avatar_url ? (
                    <img src={recipientProfile.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                  ) : getInitials(displayName())}
                </div>
                <div>
                  <p className="text-xs text-lavender-500">Sending to</p>
                  <p className="font-semibold text-lavender-800">{displayName()}</p>
                  {recipientProfile && <p className="text-sm text-lavender-500">@{recipientProfile.username}</p>}
                </div>
              </div>

              <div className="border-t border-lavender-200/30 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-lavender-500 text-sm">Amount</span>
                  <span className="font-bold text-lavender-800">${parseFloat(amount).toFixed(2)} {currency}</span>
                </div>
                {memo && (
                  <div className="flex justify-between gap-4">
                    <span className="text-lavender-500 text-sm">Memo</span>
                    <span className="text-lavender-700 text-sm text-right">{memo}</span>
                  </div>
                )}
              </div>
            </div>

            {txError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">{txError}</div>
            )}

            <button
              onClick={handleSend}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #c4b5fd, #a7f3d0)' }}
            >
              {loading ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                <><Send size={18} /> Send ${parseFloat(amount).toFixed(2)}</>
              )}
            </button>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SuccessAnimation
              show={step === 4}
              amount={formatAmount(amount)}
              recipient={recipientProfile?.username}
              txHash={txHash ?? undefined}
              onDone={() => router.push('/dashboard')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
