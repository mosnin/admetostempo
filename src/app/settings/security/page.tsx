'use client'
import { motion } from 'framer-motion'
import { Shield, Key, Smartphone, AlertTriangle, ChevronRight, Lock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export default function SecurityPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-slate-800">Security</h1>
        <p className="text-sm text-slate-500 mt-1">Protect your account and wallet</p>
      </motion.div>

      {/* Wallet Security */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Wallet</h2>
        <Card variant="glass" className="p-0 overflow-hidden divide-y divide-slate-100">
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0">
              <Key size={18} className="text-violet-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 text-sm">Custodial Wallet</p>
              <p className="text-xs text-slate-500">Your wallet is secured by Admetos. We encrypt your private key server-side.</p>
            </div>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full">Active</span>
          </div>
          <div className="flex items-start gap-3 p-4 bg-amber-50/50">
            <AlertTriangle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              <strong>Important:</strong> Admetos holds your wallet in a custodial model. We never share your private key. For maximum security, consider self-custody when the option becomes available.
            </p>
          </div>
        </Card>
      </section>

      {/* Two-Factor Auth */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Two-Factor Authentication</h2>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Smartphone size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Authenticator App</p>
              <p className="text-xs text-slate-500">Managed by Clerk — enable in your account settings</p>
            </div>
          </div>
          <a
            href="https://accounts.admetos.xyz/user"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-medium text-slate-700 transition-colors"
          >
            Manage 2FA <ChevronRight size={16} className="text-slate-400" />
          </a>
        </Card>
      </section>

      {/* Active Sessions */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sessions</h2>
        <Card variant="glass" className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
                <Shield size={14} className="text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Current session</p>
                <p className="text-xs text-slate-400">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <span className="text-xs text-emerald-600 font-semibold">Active</span>
          </div>
          <p className="text-xs text-slate-400">Session management is handled by Clerk. Sign out from all devices via your account settings.</p>
        </Card>
      </section>

      {/* Scam Protection */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scam Protection</h2>
        <Card variant="glass" className="p-4 space-y-3">
          {[
            'We will never ask for your private key via email or chat',
            'Always verify recipient addresses before sending',
            'External transfers to unknown addresses carry irreversible risk',
            'Admetos support will never DM you first asking for funds',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <Lock size={14} className="text-violet-400 mt-0.5 flex-shrink-0" />
              {tip}
            </div>
          ))}
        </Card>
      </section>
    </div>
  )
}
