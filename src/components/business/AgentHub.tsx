'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Key, Terminal, Code, CheckCircle, Clock, ExternalLink, Copy, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

const CAPABILITIES = [
  {
    icon: Bot,
    title: 'Autonomous Payments',
    description: 'Authorize an AI agent to send payments on your behalf using a scoped API key.',
    available: true,
  },
  {
    icon: Code,
    title: 'Request Handling',
    description: 'Agents can automatically pay incoming payment requests matching your rules.',
    available: true,
  },
  {
    icon: Clock,
    title: 'Scheduled Payments',
    description: 'Set recurring payments executed automatically by your agent.',
    available: false,
  },
]

const CODE_EXAMPLE = `POST /api/agent/pay
Headers: {
  "x-api-key": "admetos_agent_••••••••••••••••"
}
Body: {
  "toUsername": "coffee_shop",
  "amount":     "5.00",
  "memo":       "Iced latte"
}`

const REQUEST_EXAMPLE = `GET /api/agent/requests
Headers: {
  "x-api-key": "admetos_agent_••••••••••••••••"
}
# Returns pending payment requests
# your agent can auto-approve`

function CodeBlock({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={cn('relative rounded-xl bg-[#0f0e17] border border-[#2a2740] overflow-hidden', className)}>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 text-[#a78bfa] text-xs font-medium hover:bg-white/20 transition-colors"
      >
        {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className="px-5 py-4 text-xs font-mono text-[#c4b5fd] leading-relaxed overflow-x-auto whitespace-pre">
        {code}
      </pre>
    </div>
  )
}

function CapabilityCard({
  icon: Icon,
  title,
  description,
  available,
}: {
  icon: React.ElementType
  title: string
  description: string
  available: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-xl p-4 border transition-all',
        available
          ? 'border-[#c4b5fd]/40 bg-white/60'
          : 'border-[#e8e4fd] bg-[#f5f3ff]/60 opacity-60'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
            available ? 'bg-[#ede9fe]' : 'bg-[#f3f4f6]'
          )}
        >
          <Icon size={16} className={available ? 'text-[#7c3aed]' : 'text-[#9ca3af]'} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-[#1e1b4b]">{title}</span>
            {!available && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#ffedd5] text-[#fb923c]">
                Soon
              </span>
            )}
          </div>
          <p className="text-xs text-[#6b7280]">{description}</p>
        </div>
      </div>
    </div>
  )
}

interface ApiKey {
  key: string
  created_at: string
}

function ApiKeyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = React.useState(false)
  const [apiKey, setApiKey] = React.useState<ApiKey | null>(null)
  const [error, setError] = React.useState('')
  const [copied, setCopied] = React.useState(false)

  async function generateKey() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/agent', { method: 'POST' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to generate key')
      }
      const data = await res.json()
      setApiKey(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!apiKey) return
    navigator.clipboard.writeText(apiKey.key).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleClose() {
    setApiKey(null)
    setError('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onOpenChange={(o) => !o && handleClose()}
      title="Generate Agent API Key"
      description="Create a scoped key that AI agents can use to transact on your behalf."
    >
      <div className="space-y-4 mt-2">
        {!apiKey ? (
          <>
            <div className="rounded-xl bg-[#fffbeb] border border-[#fde68a] p-3">
              <p className="text-xs text-[#92400e] font-medium">
                ⚠ Keep your API key secret. Anyone with this key can send payments on your behalf.
              </p>
            </div>

            {error && (
              <p className="text-xs text-[#f43f5e] font-medium">{error}</p>
            )}

            <Button
              variant="primary"
              size="lg"
              loading={loading}
              onClick={generateKey}
              className="w-full"
              leftIcon={<Key size={16} />}
            >
              Generate API Key
            </Button>
          </>
        ) : (
          <>
            <div className="rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] p-3">
              <p className="text-xs text-[#065f46] font-semibold mb-1">
                ✓ API key generated successfully
              </p>
              <p className="text-xs text-[#047857]">
                Copy and save this key now — it won't be shown again.
              </p>
            </div>

            <div className="rounded-xl bg-[#0f0e17] p-4 font-mono text-sm text-[#c4b5fd] break-all">
              {apiKey.key}
            </div>

            <Button
              variant="secondary"
              size="md"
              onClick={handleCopy}
              className="w-full"
              leftIcon={copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            >
              {copied ? 'Copied!' : 'Copy Key'}
            </Button>

            <Button
              variant="ghost"
              size="md"
              onClick={() => { setApiKey(null) }}
              className="w-full"
              leftIcon={<RefreshCw size={16} />}
            >
              Generate Another
            </Button>
          </>
        )}
      </div>
    </Modal>
  )
}

export function AgentHub() {
  const [keyModalOpen, setKeyModalOpen] = React.useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="rounded-2xl bg-white/60 border border-[rgba(196,181,253,0.25)] shadow-[0_4px_24px_rgba(196,181,253,0.15)] p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0f0e17] flex items-center justify-center shrink-0">
            <Bot size={24} className="text-[#c4b5fd]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1e1b4b] mb-1">🤖 AI Payments Hub</h2>
            <p className="text-sm text-[#6b7280]">
              Enable AI agents to transact on your behalf using scoped API keys and the Admetos agent protocol.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Key size={16} />}
            onClick={() => setKeyModalOpen(true)}
          >
            Create API Key
          </Button>
          <a
            href="/docs"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#e8e4fd] text-sm font-semibold text-[#7c3aed] hover:bg-[#ede9fe] transition-colors"
          >
            <ExternalLink size={14} />
            View Docs
          </a>
        </div>
      </motion.div>

      {/* Capabilities */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.06 }}
      >
        <h3 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3">
          Supported Capabilities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CAPABILITIES.map((cap) => (
            <CapabilityCard
              key={cap.title}
              icon={cap.icon}
              title={cap.title}
              description={cap.description}
              available={cap.available}
            />
          ))}
        </div>
      </motion.div>

      {/* Machine Payment Protocol */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.12 }}
        className="rounded-2xl border border-[rgba(196,181,253,0.2)] bg-white/50 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-[rgba(196,181,253,0.15)]">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-[#7c3aed]" />
            <h3 className="text-sm font-semibold text-[#1e1b4b]">Machine Payment Protocol</h3>
          </div>
          <p className="text-xs text-[#6b7280] mt-1">
            Send a payment from your agent in a single API call.
          </p>
        </div>
        <div className="p-5">
          <CodeBlock code={CODE_EXAMPLE} />
        </div>
      </motion.div>

      {/* Request Funds Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.18 }}
        className="rounded-2xl border border-[rgba(196,181,253,0.2)] bg-white/50 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-[rgba(196,181,253,0.15)]">
          <div className="flex items-center gap-2">
            <Code size={16} className="text-[#10b981]" />
            <h3 className="text-sm font-semibold text-[#1e1b4b]">Receive Funds via Agent</h3>
          </div>
          <p className="text-xs text-[#6b7280] mt-1">
            Agents can also poll and auto-approve incoming payment requests.
          </p>
        </div>
        <div className="p-5">
          <CodeBlock code={REQUEST_EXAMPLE} />
        </div>
      </motion.div>

      {/* Docs callout */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.24 }}
        className="rounded-2xl bg-[#f5f3ff] border border-[#ddd6fe] p-4 flex items-center justify-between gap-4"
      >
        <div>
          <p className="text-sm font-semibold text-[#1e1b4b] mb-0.5">Full API Reference</p>
          <p className="text-xs text-[#6b7280]">
            Authentication, rate limits, webhooks, and SDK quickstarts.
          </p>
        </div>
        <a
          href="/docs"
          className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-[#7c3aed] hover:text-[#6d28d9] transition-colors"
        >
          Read docs <ExternalLink size={14} />
        </a>
      </motion.div>

      <ApiKeyModal open={keyModalOpen} onClose={() => setKeyModalOpen(false)} />
    </div>
  )
}
