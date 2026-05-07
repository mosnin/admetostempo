'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, DollarSign, UserPlus, Tag, Volume2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import * as Switch from '@radix-ui/react-switch'

const PREFS = [
  { key: 'payment_received', icon: DollarSign, label: 'Payment received', desc: 'When someone sends you money', color: 'emerald' },
  { key: 'payment_request', icon: DollarSign, label: 'Payment requests', desc: 'When someone requests money from you', color: 'amber' },
  { key: 'request_paid', icon: DollarSign, label: 'Request fulfilled', desc: 'When your payment request is paid', color: 'violet' },
  { key: 'new_follower', icon: UserPlus, label: 'New followers', desc: 'When someone follows you', color: 'pink' },
  { key: 'marketing', icon: Tag, label: 'Product updates', desc: 'News and feature announcements', color: 'slate' },
  { key: 'sound', icon: Volume2, label: 'Sound effects', desc: 'Play sounds on payment events', color: 'blue' },
]

export default function NotificationsSettingsPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    payment_received: true, payment_request: true, request_paid: true,
    new_follower: false, marketing: false, sound: true,
  })

  function toggle(key: string) {
    setPrefs(p => ({ ...p, [key]: !p[key] }))
    // In production: PATCH /api/settings/notifications
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-slate-800">Notifications</h1>
        <p className="text-sm text-slate-500 mt-1">Choose what you want to be notified about</p>
      </motion.div>

      <Card variant="glass" className="p-0 divide-y divide-slate-100 overflow-hidden">
        {PREFS.map(({ key, icon: Icon, label, desc, color }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-4"
          >
            <div className={`w-10 h-10 rounded-2xl bg-${color}-100 flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className={`text-${color}-600`} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 text-sm">{label}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
            <Switch.Root
              checked={prefs[key]}
              onCheckedChange={() => toggle(key)}
              className={`w-11 h-6 rounded-full transition-colors ${prefs[key] ? 'bg-violet-500' : 'bg-slate-200'}`}
            >
              <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform data-[state=checked]:translate-x-5 translate-x-0.5" />
            </Switch.Root>
          </motion.div>
        ))}
      </Card>
    </div>
  )
}
