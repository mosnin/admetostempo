'use client'

import { Shield, Zap, Sparkles } from 'lucide-react'

const pillars = [
  {
    icon: Shield,
    title: 'Privacy',
    description:
      'Your financial life is yours. We never sell your data or share your transaction history. End-to-end encryption keeps every message and payment confidential.',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-100',
  },
  {
    icon: Zap,
    title: 'Speed',
    description:
      'Transactions settle in seconds on the Tempo blockchain. Sending money should feel as fast as sending a text — because now it is.',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-100',
  },
  {
    icon: Sparkles,
    title: 'Simplicity',
    description:
      'No wallet addresses to memorise, no gas fee guessing. Just pick a contact, type an amount, and tap send. Crypto made human.',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-100',
  },
]

const values = [
  {
    title: 'Transparency',
    body: 'We publish our fee schedule, our roadmap, and our incident reports. No surprises.',
  },
  {
    title: 'Security',
    body: 'Your funds are protected by multi-layer encryption and non-custodial key management at the edge.',
  },
  {
    title: 'Accessibility',
    body: 'Financial rails should work for everyone — regardless of location, bank account, or credit history.',
  },
]

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-emerald-500 to-orange-400 leading-tight pb-1">
          About Admetos
        </h1>
        <p className="text-xl text-gray-600 max-w-xl mx-auto leading-relaxed">
          Send money like a message — instant, beautiful, and on-chain.
        </p>
        <div className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-600 text-xs font-semibold tracking-wide">
          v0.1.0 beta
        </div>
      </div>

      {/* Mission */}
      <div className="rounded-3xl bg-white/70 backdrop-blur-sm border border-white/80 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          Money is just information. Yet moving it around the world is still slow, opaque, and expensive.
          Admetos is built on the belief that payments should be as effortless as sending a message —
          arriving in seconds, costing next to nothing, and leaving you in full control of your funds.
          We&apos;re building the payment layer that the next billion on-chain users deserve.
        </p>
      </div>

      {/* Three pillars */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-800">What we stand for</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {pillars.map(({ icon: Icon, title, description, bg, border, iconColor, iconBg }) => (
            <div
              key={title}
              className={`rounded-2xl ${bg} border ${border} p-6 space-y-3`}
            >
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <h3 className="font-bold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Built on */}
      <div className="rounded-3xl bg-white/70 backdrop-blur-sm border border-white/80 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">Built on</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'Tempo', role: 'Blockchain layer', color: 'from-violet-400 to-indigo-400' },
            { name: 'Clerk', role: 'Authentication', color: 'from-emerald-400 to-teal-400' },
            { name: 'Supabase', role: 'Database & storage', color: 'from-orange-400 to-amber-400' },
          ].map(({ name, role, color }) => (
            <div key={name} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                <span className="text-white font-black text-sm">{name[0]}</span>
              </div>
              <span className="font-bold text-gray-800 text-sm">{name}</span>
              <span className="text-xs text-gray-400 text-center">{role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-800">Our values</h2>
        <div className="space-y-3">
          {values.map(({ title, body }) => (
            <div key={title} className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 p-5 shadow-sm flex gap-4">
              <div className="w-2 rounded-full bg-gradient-to-b from-violet-400 to-emerald-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="rounded-3xl bg-gradient-to-br from-violet-100 to-emerald-100 border border-violet-200/60 p-8 text-center shadow-sm">
        <p className="text-3xl mb-3">❤️</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Built with love by the Admetos team</h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
          We&apos;re a small, focused team obsessed with making money movement beautiful. If you share
          that vision, we&apos;d love to hear from you at{' '}
          <a href="mailto:hello@admetos.xyz" className="text-violet-600 hover:underline">
            hello@admetos.xyz
          </a>
          .
        </p>
      </div>
    </div>
  )
}
