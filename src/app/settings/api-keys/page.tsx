'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Key, Plus, Trash2, Copy, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

interface ApiKey {
  id: string
  name: string
  key: string
  created_at: string
  last_used_at: string | null
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [showNewKeyModal, setShowNewKeyModal] = useState(false)
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/agent').then(r => r.json()).then(d => setKeys(d.keys || [])).finally(() => setLoading(false))
  }, [])

  async function createKey() {
    if (!newKeyName.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/agent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newKeyName }) })
      const data = await res.json()
      setCreatedKey(data.key)
      setKeys(prev => [...prev, data])
      setNewKeyName('')
    } catch {}
    setCreating(false)
  }

  async function deleteKey(id: string) {
    await fetch(`/api/agent/${id}`, { method: 'DELETE' })
    setKeys(prev => prev.filter(k => k.id !== id))
  }

  const maskKey = (key: string) => key.slice(0, 8) + '••••••••••••••••' + key.slice(-4)

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">API Keys</h1>
          <p className="text-sm text-slate-500 mt-1">For machine-to-machine payments</p>
        </div>
        <Button variant="primary" onClick={() => setShowNewKeyModal(true)}>
          <Plus size={16} /> New key
        </Button>
      </div>

      {/* Warning */}
      <Card variant="glass" className="p-4 flex gap-3 border border-amber-200 bg-amber-50/50">
        <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">API keys have access to your wallet for automated payments. Treat them like passwords — never share or commit them to version control.</p>
      </Card>

      {/* Keys list */}
      {loading ? (
        <div className="text-center py-8 text-slate-400">Loading...</div>
      ) : keys.length === 0 ? (
        <Card variant="glass" className="p-8 text-center">
          <Key size={40} className="text-slate-200 mx-auto mb-3" />
          <p className="font-semibold text-slate-600">No API keys yet</p>
          <p className="text-sm text-slate-400 mt-1">Create a key to enable machine payments</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {keys.map((apiKey, i) => (
            <motion.div key={apiKey.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card variant="glass" className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm">{apiKey.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs text-slate-500 font-mono">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <button onClick={() => setVisibleKeys(s => { const n = new Set(s); s.has(apiKey.id) ? n.delete(apiKey.id) : n.add(apiKey.id); return n })}>
                        {visibleKeys.has(apiKey.id) ? <EyeOff size={12} className="text-slate-400" /> : <Eye size={12} className="text-slate-400" />}
                      </button>
                      <button onClick={() => navigator.clipboard.writeText(apiKey.key)}>
                        <Copy size={12} className="text-slate-400 hover:text-violet-500" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Created {formatDate(apiKey.created_at)}{apiKey.last_used_at ? ` · Last used ${formatDate(apiKey.last_used_at)}` : ' · Never used'}</p>
                  </div>
                  <button onClick={() => deleteKey(apiKey.id)} className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create modal */}
      <AnimatePresence>
        {showNewKeyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              {createdKey ? (
                <div className="text-center">
                  <div className="text-4xl mb-3">🔑</div>
                  <h3 className="font-bold text-slate-800 mb-2">Key created!</h3>
                  <p className="text-xs text-slate-500 mb-3">Copy now — you won't see it again.</p>
                  <div className="bg-slate-50 rounded-xl p-3 mb-4">
                    <code className="text-xs font-mono text-slate-700 break-all">{createdKey}</code>
                  </div>
                  <Button variant="primary" className="w-full" onClick={() => { navigator.clipboard.writeText(createdKey); setShowNewKeyModal(false); setCreatedKey(null) }}>
                    <Copy size={14} /> Copy & Close
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-slate-800 mb-4">Create API Key</h3>
                  <input value={newKeyName} onChange={e => setNewKeyName(e.target.value)} placeholder="Key name (e.g. My Bot)" className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-300 mb-4" />
                  <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1" onClick={() => setShowNewKeyModal(false)}>Cancel</Button>
                    <Button variant="primary" className="flex-1" onClick={createKey} disabled={creating || !newKeyName.trim()}>Create</Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
