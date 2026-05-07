'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRight, Loader2 } from 'lucide-react'
import { ChainSelector } from './ChainSelector'
import { QuoteCard, type BridgeQuote } from './QuoteCard'
import { BridgeWarning } from './BridgeWarning'
import { BridgeProgress, type BridgeStep } from './BridgeProgress'
import { CHAIN_MAP, type ChainId } from './ChainIcon'

const TOKENS = ['pathUSD', 'USDC', 'USDT']

type FormState = 'idle' | 'loading' | 'quoted' | 'executing' | 'done'

interface BridgeFormProps {
  onBridgeComplete?: (result: { txHash: string; provider: string }) => void
}

export function BridgeForm({ onBridgeComplete }: BridgeFormProps) {
  const [fromChain, setFromChain] = useState<ChainId>('tempo')
  const [toChain, setToChain] = useState<ChainId>('base')
  const [token, setToken] = useState('pathUSD')
  const [amount, setAmount] = useState('')
  const [quotes, setQuotes] = useState<BridgeQuote[]>([])
  const [selectedQuote, setSelectedQuote] = useState<BridgeQuote | null>(null)
  const [formState, setFormState] = useState<FormState>('idle')
  const [understood, setUnderstood] = useState(false)
  const [bridgeStep, setBridgeStep] = useState<BridgeStep>('initiating')
  const [txHash, setTxHash] = useState<string>('')
  const [error, setError] = useState<string>('')

  const fromChainInfo = CHAIN_MAP[fromChain]
  const toChainInfo = CHAIN_MAP[toChain]

  function handleSwapChains() {
    setFromChain(toChain)
    setToChain(fromChain)
    setQuotes([])
    setSelectedQuote(null)
    setFormState('idle')
    setUnderstood(false)
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9.]/g, '')
    const parts = raw.split('.')
    if (parts.length > 2) return
    if (parts[1] && parts[1].length > 6) return
    setAmount(raw)
    // Reset quotes when amount changes
    if (formState === 'quoted') {
      setFormState('idle')
      setQuotes([])
      setSelectedQuote(null)
      setUnderstood(false)
    }
  }

  async function handleGetQuote() {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }
    if (fromChain === toChain) {
      setError('Source and destination chains must be different')
      return
    }

    setError('')
    setFormState('loading')
    setQuotes([])
    setSelectedQuote(null)

    try {
      const res = await fetch('/api/bridge/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromChain,
          toChain,
          token,
          amount,
          userAddress: '0x0000000000000000000000000000000000000000',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch quote')

      const fetchedQuotes: BridgeQuote[] = data.quotes
      setQuotes(fetchedQuotes)
      // Auto-select the best (highest output)
      const best = fetchedQuotes.reduce((a, b) =>
        parseFloat(a.outputAmount) >= parseFloat(b.outputAmount) ? a : b
      )
      setSelectedQuote(best)
      setFormState('quoted')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get quote')
      setFormState('idle')
    }
  }

  async function handleExecuteBridge() {
    if (!selectedQuote || !understood) return

    setFormState('executing')
    setBridgeStep('initiating')

    // Simulate bridge execution steps
    const mockTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`

    await delay(1200)
    setBridgeStep('pending')
    setTxHash(mockTxHash)

    await delay(2000)
    setBridgeStep('confirming')

    await delay(2500)
    setBridgeStep('complete')
    setFormState('done')

    onBridgeComplete?.({ txHash: mockTxHash, provider: selectedQuote.provider })
  }

  function handleReset() {
    setFormState('idle')
    setQuotes([])
    setSelectedQuote(null)
    setUnderstood(false)
    setAmount('')
    setBridgeStep('initiating')
    setTxHash('')
    setError('')
  }

  const getBestQuote = () => {
    if (quotes.length === 0) return null
    return quotes.reduce((a, b) =>
      parseFloat(a.outputAmount) >= parseFloat(b.outputAmount) ? a : b
    )
  }

  const bestQuote = getBestQuote()
  const canGetQuote = amount && parseFloat(amount) > 0 && fromChain !== toChain
  const canExecute = selectedQuote && understood && formState === 'quoted'

  return (
    <div className="space-y-4">
      {/* Main form card */}
      <div className="card-pastel rounded-3xl p-6 space-y-5">

        {/* Chain row */}
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <ChainSelector
              value={fromChain}
              onChange={(v) => {
                setFromChain(v)
                setFormState('idle')
                setQuotes([])
                setSelectedQuote(null)
                setUnderstood(false)
              }}
              label="From"
              excludeChain={toChain}
            />
          </div>

          {/* Swap button */}
          <motion.button
            type="button"
            onClick={handleSwapChains}
            whileHover={{ rotate: 180, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="
              w-11 h-11 rounded-full mb-0.5
              bg-gradient-lavender-mint
              flex items-center justify-center
              shadow-lavender-glow
              hover:shadow-pastel-md
              transition-shadow duration-200
              focus:outline-none focus:ring-2 focus:ring-lavender-300
            "
            aria-label="Swap chains"
          >
            <ArrowLeftRight size={16} className="text-white" />
          </motion.button>

          <div className="flex-1">
            <ChainSelector
              value={toChain}
              onChange={(v) => {
                setToChain(v)
                setFormState('idle')
                setQuotes([])
                setSelectedQuote(null)
                setUnderstood(false)
              }}
              label="To"
              excludeChain={fromChain}
            />
          </div>
        </div>

        {/* Chain connection visual */}
        <motion.div
          initial={false}
          className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium"
        >
          <span className="text-base">{fromChainInfo.logo}</span>
          <span className="text-gray-300">{fromChainInfo.name}</span>
          <div className="flex items-center gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full bg-lavender-300"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15 }}
              />
            ))}
          </div>
          <span className="text-gray-300">{toChainInfo.name}</span>
          <span className="text-base">{toChainInfo.logo}</span>
        </motion.div>

        {/* Token + Amount row */}
        <div className="flex gap-3">
          {/* Token selector */}
          <div className="w-36">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-1">Token</label>
            <select
              value={token}
              onChange={(e) => {
                setToken(e.target.value)
                setFormState('idle')
                setQuotes([])
                setSelectedQuote(null)
                setUnderstood(false)
              }}
              className="
                w-full px-3 py-3 rounded-2xl
                bg-white/70 backdrop-blur-sm
                border border-[rgba(196,181,253,0.3)]
                text-sm font-semibold text-gray-800
                focus:outline-none focus:ring-2 focus:ring-lavender-300
                cursor-pointer appearance-none
                shadow-[0_2px_8px_rgba(196,181,253,0.15)]
              "
            >
              {TOKENS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Amount input */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-1">Amount</label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              className="
                w-full px-4 py-3 rounded-2xl
                bg-white/70 backdrop-blur-sm
                border border-[rgba(196,181,253,0.3)]
                text-sm font-semibold text-gray-800
                placeholder:text-gray-300
                focus:outline-none focus:ring-2 focus:ring-lavender-300
                shadow-[0_2px_8px_rgba(196,181,253,0.15)]
              "
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-rose-500 font-medium px-1"
          >
            {error}
          </motion.p>
        )}

        {/* Get Quote button */}
        {formState !== 'executing' && formState !== 'done' && (
          <motion.button
            type="button"
            onClick={handleGetQuote}
            disabled={!canGetQuote || formState === 'loading'}
            whileHover={canGetQuote ? { scale: 1.01 } : {}}
            whileTap={canGetQuote ? { scale: 0.98 } : {}}
            className="
              w-full py-4 rounded-2xl
              bg-gradient-lavender-mint
              text-white font-bold text-sm
              disabled:opacity-40 disabled:cursor-not-allowed
              shadow-lavender-glow hover:shadow-pastel-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-lavender-300 focus:ring-offset-2
              flex items-center justify-center gap-2
            "
          >
            {formState === 'loading' ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Fetching Quotes...
              </>
            ) : formState === 'quoted' ? (
              'Refresh Quote'
            ) : (
              'Get Quote'
            )}
          </motion.button>
        )}
      </div>

      {/* Quotes panel */}
      {formState === 'quoted' && quotes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="space-y-3"
        >
          <p className="text-sm font-semibold text-gray-600 px-1">Choose your bridge provider</p>
          <div className="grid grid-cols-2 gap-3">
            {quotes.map((q) => (
              <QuoteCard
                key={q.provider}
                quote={q}
                isBest={bestQuote?.provider === q.provider}
                isSelected={selectedQuote?.provider === q.provider}
                onSelect={() => setSelectedQuote(q)}
                token={token}
              />
            ))}
          </div>

          {/* Warning */}
          <BridgeWarning understood={understood} onUnderstoodChange={setUnderstood} />

          {/* Execute button */}
          <motion.button
            type="button"
            onClick={handleExecuteBridge}
            disabled={!canExecute}
            whileHover={canExecute ? { scale: 1.01 } : {}}
            whileTap={canExecute ? { scale: 0.98 } : {}}
            className="
              w-full py-4 rounded-2xl
              bg-gradient-to-r from-peach-300 to-peach-400
              text-white font-bold text-sm
              disabled:opacity-40 disabled:cursor-not-allowed
              shadow-peach-glow hover:shadow-pastel-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-peach-300 focus:ring-offset-2
            "
          >
            Execute Bridge via {selectedQuote ? (selectedQuote.provider === 'layerzero' ? 'LayerZero' : 'Relay') : '...'}
          </motion.button>
        </motion.div>
      )}

      {/* Progress display */}
      {(formState === 'executing' || formState === 'done') && selectedQuote && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="space-y-3"
        >
          <BridgeProgress
            currentStep={bridgeStep}
            provider={selectedQuote.provider}
            txHash={txHash || undefined}
          />
          {formState === 'done' && (
            <button
              type="button"
              onClick={handleReset}
              className="
                w-full py-3 rounded-2xl
                bg-gradient-lavender-mint
                text-white font-bold text-sm
                shadow-lavender-glow hover:shadow-pastel-md
                transition-all duration-200
              "
            >
              Bridge Again
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
