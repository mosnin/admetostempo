'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface EditProfileFormProps {
  initialValues: {
    display_name: string
    bio: string | null
    username: string
  }
  onSave: (values: { display_name: string; bio: string; username: string }) => Promise<void>
}

export function EditProfileForm({ initialValues, onSave }: EditProfileFormProps) {
  const [values, setValues] = useState({
    display_name: initialValues.display_name || '',
    bio: initialValues.bio || '',
    username: initialValues.username || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!values.display_name.trim()) newErrors.display_name = 'Name is required'
    if (values.username.length < 3) newErrors.username = 'Username must be at least 3 characters'
    if (!/^[a-z0-9_]+$/.test(values.username)) newErrors.username = 'Only lowercase letters, numbers, and underscores'
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }

    setSaving(true)
    try {
      await onSave(values)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setErrors({ form: 'Failed to save. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
        <input
          value={values.display_name}
          onChange={e => setValues(v => ({ ...v, display_name: e.target.value }))}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-violet-300 text-slate-800"
          placeholder="Your name"
          maxLength={50}
        />
        {errors.display_name && <p className="text-xs text-rose-500 mt-1">{errors.display_name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
        <textarea
          value={values.bio}
          onChange={e => setValues(v => ({ ...v, bio: e.target.value }))}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-violet-300 text-slate-800 resize-none"
          placeholder="Tell people a little about yourself"
          rows={3}
          maxLength={160}
        />
        <p className="text-xs text-slate-400 text-right mt-0.5">{values.bio.length}/160</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">@</span>
          <input
            value={values.username}
            onChange={e => setValues(v => ({ ...v, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
            className="w-full pl-8 pr-4 py-3 rounded-2xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-violet-300 text-slate-800"
            placeholder="username"
            maxLength={30}
          />
        </div>
        {errors.username && <p className="text-xs text-rose-500 mt-1">{errors.username}</p>}
      </div>

      {errors.form && <p className="text-sm text-rose-500">{errors.form}</p>}

      <Button type="submit" variant="primary" disabled={saving} className="w-full">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save changes'}
      </Button>
    </form>
  )
}
