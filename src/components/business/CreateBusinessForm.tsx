'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Building2, Globe, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { CATEGORIES } from './CategoryChips'

const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c.value !== 'all').map((c) => ({
  value: c.value,
  label: c.label,
}))

export interface CreateBusinessFormProps {
  onSuccess?: (username: string) => void
}

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken'

export function CreateBusinessForm({ onSuccess }: CreateBusinessFormProps) {
  const router = useRouter()
  const [name, setName] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [website, setWebsite] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')
  const [usernameStatus, setUsernameStatus] = React.useState<UsernameStatus>('idle')
  const usernameTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setName(val)
    // Auto-suggest username from name
    if (!username) {
      setUsername(
        val
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, '_')
          .replace(/__+/g, '_')
          .slice(0, 30)
      )
    }
  }

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 30)
    setUsername(val)
    setUsernameStatus('idle')

    if (usernameTimer.current) clearTimeout(usernameTimer.current)
    if (val.length >= 3) {
      setUsernameStatus('checking')
      usernameTimer.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/business/check-username?username=${val}`)
          if (res.ok) {
            const data = await res.json()
            setUsernameStatus(data.available ? 'available' : 'taken')
          } else {
            setUsernameStatus('idle')
          }
        } catch {
          setUsernameStatus('idle')
        }
      }, 500)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !username || !category || !description) {
      setError('Please fill in all required fields.')
      return
    }
    if (usernameStatus === 'taken') {
      setError('That username is already taken.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, category, description, website }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to create business')
      }
      if (onSuccess) {
        onSuccess(username)
      } else {
        router.push('/settings/business/products')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const usernameRightIcon =
    usernameStatus === 'checking' ? (
      <Loader2 size={14} className="animate-spin text-[#a78bfa]" />
    ) : usernameStatus === 'available' ? (
      <CheckCircle size={14} className="text-[#10b981]" />
    ) : usernameStatus === 'taken' ? (
      <AlertCircle size={14} className="text-[#f43f5e]" />
    ) : null

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="space-y-5"
    >
      <Input
        label="Business Name *"
        placeholder="Acme Coffee Co."
        value={name}
        onChange={handleNameChange}
        leftIcon={<Building2 size={16} />}
        required
      />

      <div>
        <Input
          label="Username *"
          placeholder="acme_coffee"
          value={username}
          onChange={handleUsernameChange}
          rightIcon={usernameRightIcon}
          hint={
            usernameStatus === 'available'
              ? '✓ Username is available'
              : usernameStatus === 'taken'
              ? undefined
              : 'Letters, numbers, underscores only'
          }
          error={usernameStatus === 'taken' ? 'Username is already taken' : undefined}
          required
        />
      </div>

      <Select
        label="Category *"
        placeholder="Select a category"
        options={CATEGORY_OPTIONS}
        value={category}
        onValueChange={setCategory}
      />

      <Textarea
        label="Description *"
        placeholder="Tell customers what you offer..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        maxLength={300}
      />

      <Input
        label="Website"
        placeholder="https://yoursite.com"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        leftIcon={<Globe size={16} />}
        type="url"
      />

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-[#f43f5e] font-medium"
        >
          {error}
        </motion.p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={submitting}
        className="w-full"
      >
        Create Business Account
      </Button>
    </motion.form>
  )
}
