'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, ArrowUpRight, ArrowDownLeft, ExternalLink, Shield, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { useProfile } from '@/hooks/useProfile'
import { QRCode } from '@/components/ui/QRCode'
import { CopyButton } from '@/components/ui/CopyButton'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatAmount, truncateAddress } from '@/lib/utils'
import Link from 'next/link'

export default function WalletPage() {
  const { profile, loading: profileLoading } = useProfile()
  const [showFullAddress, setShowFullAddress] = useState(false)
  const [activeTab, setActiveTab] = useState<'receive' | 'assets'>('receive')
  const [balance, setBalance] = useState<string | null>(null)
  const [balanceLoading, setBalanceLoading] = useState(false)

  async function refreshBalance() {
    setBalanceLoading(true)
    try {
      const res = await fetch('/api/balance')
      const data = await res.json()
      setBalance(data.formatted || '0.00')
    } catch {}
    finally { setBalanceLoading(false) }
  }

  const address = profile?.wallet_address

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-8 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-gray-900">My Wallet</h1>
        <p className="text-sm text-gray-500 mt-0.5">Tempo Testnet · pathUSD</p>
      </motion.div>

      {/* Balance card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card variant="glass" className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-emerald-500/5 to-orange-500/10 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500 font-medium">Available Balance</span>
              <button onClick={refreshBalance} className="p-1 rounded-lg hover:bg-white/50 transition-colors">
                <RefreshCw className={`w-4 h-4 text-gray-400 ${balanceLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {balanceLoading ? (
              <Skeleton variant="text" className="h-10 w-32 mb-3" />
            ) : (
              <div className="text-4xl font-black text-gray-900 mb-1">
                {balance ? formatAmount(balance) : <span className="text-gray-300">—</span>}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Badge variant="confirmed">pathUSD</Badge>
              <span className="text-xs text-gray-400">on Tempo Testnet</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 gap-3">
        <Link href="/send">
          <Button variant="primary" className="w-full gap-2">
            <ArrowUpRight className="w-4 h-4" /> Send
          </Button>
        </Link>
        <Link href="/request">
          <Button variant="secondary" className="w-full gap-2">
            <ArrowDownLeft className="w-4 h-4" /> Request
          </Button>
        </Link>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/60 rounded-2xl p-1 backdrop-blur-sm">
        {(['receive', 'assets'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${activeTab === tab ? 'bg-white shadow-sm text-violet-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab === 'receive' ? 'Receive' : 'Assets'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'receive' && (
          <motion.div key="receive" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
            <Card variant="glass" className="p-6 flex flex-col items-center gap-4">
              <p className="text-sm text-gray-500 text-center">Scan to send to your wallet</p>
              {profileLoading ? (
                <Skeleton variant="rect" className="w-48 h-48 rounded-2xl" />
              ) : address ? (
                <QRCode value={address} size={192} className="flex flex-col items-center" />
              ) : (
                <div className="w-48 h-48 rounded-2xl bg-violet-50 flex items-center justify-center">
                  <Wallet className="w-12 h-12 text-violet-200" />
                </div>
              )}
              {address && (
                <div className="w-full">
                  <div className="flex items-center justify-between bg-violet-50 rounded-xl p-3">
                    <span className="text-xs font-mono text-gray-600 truncate mr-2">
                      {showFullAddress ? address : truncateAddress(address, 8)}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => setShowFullAddress(!showFullAddress)} className="p-1 rounded hover:bg-violet-100">
                        {showFullAddress ? <EyeOff className="w-3.5 h-3.5 text-gray-400" /> : <Eye className="w-3.5 h-3.5 text-gray-400" />}
                      </button>
                      <CopyButton value={address} />
                    </div>
                  </div>
                  <a
                    href={`${process.env.NEXT_PUBLIC_TEMPO_EXPLORER_URL || 'https://explorer.testnet.tempo.xyz'}/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-violet-500 transition-colors"
                  >
                    View on Tempo Explorer <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {activeTab === 'assets' && (
          <motion.div key="assets" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
            {[
              { name: 'pathUSD', symbol: 'pUSD', color: 'violet', description: 'Primary stablecoin on Tempo' },
              { name: 'AlphaUSD', symbol: 'aUSD', color: 'emerald', description: 'Alpha stablecoin' },
              { name: 'BetaUSD', symbol: 'bUSD', color: 'orange', description: 'Beta stablecoin' },
            ].map((token, i) => (
              <motion.div key={token.symbol} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card variant="glass" className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${token.color}-400 to-${token.color}-600 flex items-center justify-center text-white font-bold text-sm`}>
                      {token.symbol.slice(0, 1)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{token.name}</div>
                      <div className="text-xs text-gray-400">{token.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-700 text-sm">$0.00</div>
                    <div className="text-xs text-gray-400">{token.symbol}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
            <div className="flex items-center gap-2 text-xs text-gray-400 justify-center mt-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Custodial wallet · Secured by Admetos</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bridge CTA */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Link href="/bridge">
          <Card variant="glass" className="p-4 flex items-center justify-between hover:shadow-lg transition-all cursor-pointer group">
            <div>
              <div className="font-semibold text-gray-800 text-sm">Bridge tokens to Tempo</div>
              <div className="text-xs text-gray-400">LayerZero &amp; Relay supported</div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Card>
        </Link>
      </motion.div>
    </div>
  )
}
