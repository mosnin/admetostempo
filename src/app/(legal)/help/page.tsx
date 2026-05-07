'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const faqs = [
  {
    q: 'How do I send money?',
    a: 'Tap the "Send" button on your home screen, search for a contact by username or scan their QR code, enter the amount and an optional note, then tap "Send". The funds arrive in their wallet within seconds.',
  },
  {
    q: 'What stablecoins can I use?',
    a: 'Admetos currently supports USDC and USDT on the Tempo blockchain. We plan to add additional stablecoins — including DAI and PYUSD — in future updates. The bridge feature lets you convert assets from other networks.',
  },
  {
    q: 'Is my wallet secure?',
    a: 'Yes. Your private keys are encrypted with AES-256 and stored server-side in a secure enclave — they are never exposed to your browser or device. All connections use TLS 1.3, and we perform regular security audits.',
  },
  {
    q: 'How do I add a business account?',
    a: 'Go to Settings → Account type and select "Switch to Business". You can then set a business name, add a bio, and access business-specific analytics. Business accounts also support payment links and QR code generation.',
  },
  {
    q: 'What is the bridge?',
    a: 'The bridge lets you move stablecoins from other blockchains (like Ethereum or Solana) into your Admetos wallet on Tempo, and vice versa. Navigate to the Bridge tab, select your source network and asset, and follow the prompts. Bridge transactions may incur a small third-party fee shown before confirmation.',
  },
  {
    q: 'How long do transactions take?',
    a: 'Payments between Admetos users on the Tempo blockchain typically confirm in under 5 seconds. Bridge transactions depend on the source chain and usually take 1–5 minutes. You can track the status of any transaction in your activity feed.',
  },
  {
    q: 'What if I sent to the wrong address?',
    a: 'Blockchain transactions are irreversible once confirmed. If you sent to another Admetos user by username, contact them directly to request a refund. If you sent to an external wallet address that was wrong, unfortunately there is no way to reverse the transaction — always double-check addresses before sending.',
  },
  {
    q: 'How do I change my username?',
    a: 'Go to Settings → Profile and tap the pencil icon next to your username. Usernames must be 3–20 characters, contain only letters, numbers, and underscores, and must not already be taken. You can change your username once every 30 days.',
  },
  {
    q: 'Is there a fee for transfers?',
    a: 'No. Admetos currently charges zero fees for sending and receiving stablecoins between users. Tempo network gas costs are subsidised by Admetos during the beta period. We will give at least 30 days\' notice before introducing any fees.',
  },
  {
    q: 'How do I report a scam?',
    a: 'If you believe you\'ve encountered a scam or fraudulent account, tap the three-dot menu on the user\'s profile and select "Report". You can also email us at support@admetos.xyz with details. We investigate all reports and may suspend accounts that violate our Terms of Service.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-800 text-sm leading-snug">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HelpPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-violet-500 pb-1">
          Help Center
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Answers to the most common questions about Admetos. Can&apos;t find what you&apos;re looking
          for?{' '}
          <a href="mailto:support@admetos.xyz" className="text-violet-600 hover:underline">
            Contact support.
          </a>
        </p>
      </div>

      {/* FAQ */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-700">Frequently asked questions</h2>
        <div className="space-y-2">
          {faqs.map(({ q, a }) => (
            <FAQItem key={q} q={q} a={a} />
          ))}
        </div>
      </div>

      {/* Still need help */}
      <div className="rounded-3xl bg-gradient-to-br from-violet-100 to-orange-100 border border-violet-200/60 p-8 text-center shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Still need help?</h2>
        <p className="text-gray-600 text-sm max-w-sm mx-auto mb-4">
          Our support team typically replies within a few hours on weekdays.
        </p>
        <a
          href="mailto:support@admetos.xyz"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-emerald-500 text-white text-sm font-semibold shadow hover:opacity-90 transition-opacity"
        >
          Email support
        </a>
      </div>
    </div>
  )
}
