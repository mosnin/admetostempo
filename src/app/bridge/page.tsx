'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftRight, Info, Clock, ExternalLink, ChevronDown } from 'lucide-react'
import { BridgeForm } from '@/components/bridge/BridgeForm'
import { ChainIcon, CHAINS } from '@/components/bridge/ChainIcon'

// ─── Mock bridge history ────────────────────────────────────────────────────

interface BridgeTx {
  id: string
  date: string
  fromChain: string
  toChain: string
  fromLogo: string
  toLogo: string
  amount: string
  token: string
  provider: 'layerzero' | 'relay'
  status: 'complete' | 'pending' | 'failed'
  txHash: string
}

const MOCK_HISTORY: BridgeTx[] = [
  {
    id: '1',
    date: '2025-05-06T10:23:00Z',
    fromChain: 'Tempo',
    toChain: 'Base',
    fromLogo: '⚡',
    toLogo: '🔵',
    amount: '250.00',
    token: 'pathUSD',
    provider: 'layerzero',
    status: 'complete',
    txHash: '0xabc123def456abc123def456abc123def456abc123def456abc123def456abc1',
  },
  {
    id: '2',
    date: '2025-05-04T14:55:00Z',
    fromChain: 'Ethereum',
    toChain: 'Tempo',
    fromLogo: '⟠',
    toLogo: '⚡',
    amount: '100.00',
    token: 'USDC',
    provider: 'relay',
    status: 'complete',
    txHash: '0xdef789abc012def789abc012def789abc012def789abc012def789abc012def7',
  },
  {
    id: '3',
    date: '2025-05-02T09:10:00Z',
    fromChain: 'Tempo',
    toChain: 'Arbitrum',
    fromLogo: '⚡',
    toLogo: '🔷',
    amount: '500.00',
    token: 'USDT',
    provider: 'layerzero',
    status: 'pending',
    txHash: '0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0',
  },
]

const STATUS_STYLES = {
  complete: 'bg-mint-100 text-mint-600',
  pending:  'bg-peach-100 text-peach-500',
  failed:   'bg-rose-100 text-rose-500',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function truncateHash(hash: string) {
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  )
}

function BridgeHistorySection({ history }: { history: BridgeTx[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (history.length === 0) {
    return (
      <div className="card-pastel rounded-3xl p-8 text-center">
        <p className="text-2xl mb-2">🌉</p>
        <p className="text-gray-500 text-sm">No bridge transactions yet</p>
        <p className="text-gray-400 text-xs mt-1">Your cross-chain transfers will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {history.map((tx) => (
        <motion.div
          key={tx.id}
          layout
          className="card-pastel rounded-2xl overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setExpanded(expanded === tx.id ? null : tx.id)}
            className="w-full flex items-center gap-3 p-4 text-left hover:bg-lavender-50/50 transition-colors"
          >
            {/* Chain icons */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-xl">{tx.fromLogo}</span>
              <ArrowLeftRight size={12} className="text-gray-400" />
              <span className="text-xl">{tx.toLogo}</span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {tx.fromChain} → {tx.toChain}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(tx.date)} · {tx.provider === 'layerzero' ? 'LayerZero' : 'Relay'}
              </p>
            </div>

            {/* Amount + status */}
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-gray-800">{tx.amount} {tx.token}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[tx.status]}`}>
                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
              </span>
            </div>

            <motion.span
              animate={{ rotate: expanded === tx.id ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <ChevronDown size={14} className="text-gray-400" />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {expanded === tx.id && (
              <motion.div
                key="details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 border-t border-lavender-100 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Transaction Hash</span>
                    <a
                      href={`#tx-${tx.txHash}`}
                      className="flex items-center gap-1 text-lavender-600 hover:text-lavender-700 font-mono hover:underline transition-colors"
                    >
                      {truncateHash(tx.txHash)}
                      <ExternalLink size={10} />
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Provider</span>
                    <span className="text-gray-700 font-semibold">
                      {tx.provider === 'layerzero' ? '⬡ LayerZero' : '◈ Relay'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

function InfoSection() {
  return (
    <div className="card-pastel rounded-3xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Info size={16} className="text-lavender-500" />
        <h3 className="font-bold text-gray-800">About Bridging</h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        Bridging lets you move stablecoins between Tempo and other EVM-compatible blockchains.
        Admetos uses two industry-leading bridge providers to find the best route.
      </p>

      {/* Providers */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-lavender-50 border border-lavender-200 p-3">
          <p className="font-bold text-lavender-700 text-sm mb-1">⬡ LayerZero</p>
          <p className="text-xs text-gray-600">Stargate pools and OFT adapters. Industry-standard cross-chain messaging.</p>
        </div>
        <div className="rounded-2xl bg-mint-50 border border-mint-200 p-3">
          <p className="font-bold text-mint-700 text-sm mb-1">◈ Relay</p>
          <p className="text-xs text-gray-600">Token discovery and transfer with real-time status tracking.</p>
        </div>
      </div>

      {/* Supported chains */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Supported Chains</p>
        <div className="flex flex-wrap gap-2">
          {CHAINS.map((chain) => (
            <span
              key={chain.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-lavender-200 text-xs font-semibold text-gray-700"
            >
              <span>{chain.logo}</span>
              {chain.name}
            </span>
          ))}
        </div>
      </div>

      {/* Time info */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-peach-50 border border-peach-200">
        <Clock size={14} className="text-peach-500 shrink-0 mt-0.5" />
        <p className="text-xs text-peach-700">
          Bridge transfers typically complete in <strong>30–90 seconds</strong>, depending on network conditions and the selected provider.
        </p>
      </div>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function BridgePage() {
  const [recentBridges, setRecentBridges] = useState<BridgeTx[]>(MOCK_HISTORY)

  function handleBridgeComplete(result: { txHash: string; provider: string }) {
    const newTx: BridgeTx = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      fromChain: 'Tempo',
      toChain: 'Base',
      fromLogo: '⚡',
      toLogo: '🔵',
      amount: '0.00',
      token: 'pathUSD',
      provider: result.provider as 'layerzero' | 'relay',
      status: 'complete',
      txHash: result.txHash,
    }
    setRecentBridges((prev) => [newTx, ...prev])
  }

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-8">

      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="pt-2"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-lavender-mint flex items-center justify-center shadow-lavender-glow">
            <ArrowLeftRight size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Bridge</h1>
            <p className="text-sm text-gray-500">Move stablecoins cross-chain via LayerZero or Relay</p>
          </div>
        </div>
      </motion.div>

      {/* Bridge form */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.05 }}
      >
        <BridgeForm onBridgeComplete={handleBridgeComplete} />
      </motion.section>

      {/* Bridge history */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
      >
        <SectionHeader
          title="Bridge History"
          subtitle="Your recent cross-chain transfers"
        />
        <BridgeHistorySection history={recentBridges} />
      </motion.section>

      {/* Info section */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.15 }}
        className="pb-4"
      >
        <InfoSection />
      </motion.section>

    </div>
  )
}
