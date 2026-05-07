'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import {
  Wallet,
  CheckCircle,
  Sparkles,
  User,
  AtSign,
  Briefcase,
  ArrowRight,
  Copy,
  Check,
  Loader2,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

type AccountType = 'personal' | 'business'

interface FormData {
  username: string
  displayName: string
  bio: string
  accountType: AccountType
}

interface WalletResult {
  address: string
  success: boolean
}

// ─── Step indicator ──────────────────────────────────────────────────────────

const TOTAL_STEPS = 5

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
        const step = i + 1
        const done = step < current
        const active = step === current
        return (
          <motion.div
            key={step}
            initial={false}
            animate={{
              width: active ? 32 : 10,
              backgroundColor: done
                ? '#34d399'
                : active
                ? '#8b5cf6'
                : '#ddd6fe',
            }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="h-2.5 rounded-full"
          />
        )
      })}
    </div>
  )
}

// ─── Animation variants ───────────────────────────────────────────────────────

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
}

const pageTransition = { duration: 0.35, ease: 'easeInOut' }

// ─── Step 1: Welcome ──────────────────────────────────────────────────────────

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="text-6xl mb-6 inline-block"
      >
        <Sparkles className="w-16 h-16 mx-auto" style={{ color: '#8b5cf6' }} />
      </motion.div>

      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
        Welcome to Admetos!
      </h1>
      <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
        Let&apos;s set up your account in a few quick steps.
      </p>

      <div className="space-y-3 text-left mb-8">
        {[
          {
            icon: <AtSign className="w-5 h-5" style={{ color: '#8b5cf6' }} />,
            title: 'Choose a username',
            desc: 'Your unique Admetos handle',
          },
          {
            icon: <User className="w-5 h-5" style={{ color: '#10b981' }} />,
            title: 'Create your profile',
            desc: 'Tell people a little about you',
          },
          {
            icon: <Wallet className="w-5 h-5" style={{ color: '#fb923c' }} />,
            title: 'Auto-generate a wallet',
            desc: 'Secure Tempo blockchain wallet',
          },
        ].map(({ icon, title, desc }) => (
          <div
            key={title}
            className="flex items-center gap-3 p-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.5)' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--gradient-card)' }}
            >
              {icon}
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                {title}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
        style={{ background: 'var(--gradient-lm)' }}
      >
        Get Started
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── Step 2: Username ─────────────────────────────────────────────────────────

function UsernameStep({
  value,
  onChange,
  onNext,
}: {
  value: string
  onChange: (v: string) => void
  onNext: () => void
}) {
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [touched, setTouched] = useState(false)

  const checkAvailability = useCallback(async (username: string) => {
    if (username.length < 3) {
      setAvailable(null)
      return
    }
    setChecking(true)
    try {
      const res = await fetch(
        `/api/profile/check-username?username=${encodeURIComponent(username)}`
      )
      const json = await res.json()
      setAvailable(json.available)
    } catch {
      setAvailable(null)
    } finally {
      setChecking(false)
    }
  }, [])

  // Debounce
  useEffect(() => {
    if (!touched) return
    const timer = setTimeout(() => checkAvailability(value), 600)
    return () => clearTimeout(timer)
  }, [value, touched, checkAvailability])

  const isValidFormat = /^[a-z0-9_]{3,20}$/.test(value)
  const canProceed = isValidFormat && available === true

  return (
    <div>
      <div className="text-center mb-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--gradient-card)' }}
        >
          <AtSign className="w-7 h-7" style={{ color: '#8b5cf6' }} />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Choose a username
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          This is how people will find and pay you on Admetos.
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 font-medium"
            style={{ color: 'var(--color-text-muted)' }}
          >
            @
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setTouched(true)
              onChange(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
            }}
            placeholder="yourname"
            maxLength={20}
            className="w-full pl-8 pr-12 py-4 rounded-2xl text-lg font-medium outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.7)',
              border: '1.5px solid',
              borderColor:
                !touched || value.length < 3
                  ? 'var(--color-border)'
                  : available === true
                  ? '#34d399'
                  : available === false
                  ? '#fb7185'
                  : 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {checking && (
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#8b5cf6' }} />
            )}
            {!checking && available === true && (
              <CheckCircle className="w-5 h-5" style={{ color: '#34d399' }} />
            )}
            {!checking && available === false && (
              <span className="text-sm font-medium" style={{ color: '#fb7185' }}>
                ✕
              </span>
            )}
          </div>
        </div>

        {touched && value.length >= 3 && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm"
            style={{
              color:
                available === true
                  ? '#10b981'
                  : available === false
                  ? '#fb7185'
                  : 'var(--color-text-muted)',
            }}
          >
            {checking
              ? 'Checking availability…'
              : available === true
              ? '@' + value + ' is available!'
              : available === false
              ? 'That username is already taken.'
              : ''}
          </motion.p>
        )}

        {touched && value.length > 0 && !isValidFormat && (
          <p className="mt-2 text-sm" style={{ color: '#fb7185' }}>
            3–20 characters, lowercase letters, numbers, and underscores only.
          </p>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
        style={{
          background: canProceed ? 'var(--gradient-lm)' : 'var(--color-lavender-200)',
          cursor: canProceed ? 'pointer' : 'not-allowed',
          opacity: canProceed ? 1 : 0.7,
        }}
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── Step 3: Profile ──────────────────────────────────────────────────────────

function ProfileStep({
  data,
  onChange,
  onNext,
}: {
  data: FormData
  onChange: (patch: Partial<FormData>) => void
  onNext: () => void
}) {
  const canProceed = data.displayName.trim().length >= 2

  return (
    <div>
      <div className="text-center mb-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--gradient-card)' }}
        >
          <User className="w-7 h-7" style={{ color: '#10b981' }} />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Your Profile
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Help people know who they&apos;re paying.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--color-text)' }}
          >
            Display name <span style={{ color: '#fb7185' }}>*</span>
          </label>
          <input
            type="text"
            value={data.displayName}
            onChange={(e) => onChange({ displayName: e.target.value })}
            placeholder="Your full name"
            maxLength={50}
            className="w-full px-4 py-3.5 rounded-2xl outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.7)',
              border: '1.5px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--color-text)' }}
          >
            Bio{' '}
            <span className="font-normal" style={{ color: 'var(--color-text-muted)' }}>
              (optional)
            </span>
          </label>
          <textarea
            value={data.bio}
            onChange={(e) => onChange({ bio: e.target.value })}
            placeholder="Tell people a little about yourself…"
            maxLength={160}
            rows={3}
            className="w-full px-4 py-3.5 rounded-2xl outline-none resize-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.7)',
              border: '1.5px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
          <p className="text-xs mt-1 text-right" style={{ color: 'var(--color-text-muted)' }}>
            {data.bio.length}/160
          </p>
        </div>

        {/* Account type */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
            Account type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { value: 'personal', label: 'Personal', icon: <User className="w-5 h-5" /> },
                { value: 'business', label: 'Business', icon: <Briefcase className="w-5 h-5" /> },
              ] as const
            ).map(({ value, label, icon }) => {
              const active = data.accountType === value
              return (
                <button
                  key={value}
                  onClick={() => onChange({ accountType: value })}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all"
                  style={{
                    background: active ? 'var(--gradient-card)' : 'rgba(255,255,255,0.5)',
                    border: '1.5px solid',
                    borderColor: active ? '#c4b5fd' : 'var(--color-border)',
                    color: active ? '#8b5cf6' : 'var(--color-text-muted)',
                  }}
                >
                  {icon}
                  <span className="text-sm font-medium">{label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
        style={{
          background: canProceed ? 'var(--gradient-lm)' : 'var(--color-lavender-200)',
          cursor: canProceed ? 'pointer' : 'not-allowed',
          opacity: canProceed ? 1 : 0.7,
        }}
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── Step 4: Wallet Creating ──────────────────────────────────────────────────

function WalletStep({
  data,
  onDone,
}: {
  data: FormData
  onDone: (result: WalletResult) => void
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [walletAddress, setWalletAddress] = useState('')
  const [copied, setCopied] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const createWallet = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await fetch('/api/wallet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          displayName: data.displayName,
          bio: data.bio,
          isBusiness: data.accountType === 'business',
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? 'Failed to create wallet')
      }

      const json = await res.json()
      setWalletAddress(json.address ?? json.wallet_address ?? '')
      setStatus('success')
      onDone({ address: json.address ?? json.wallet_address ?? '', success: true })
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }, [data, onDone])

  // Auto-start on mount
  useEffect(() => {
    createWallet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const truncate = (addr: string) =>
    addr ? addr.slice(0, 6) + '…' + addr.slice(-4) : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="text-center">
      <AnimatePresence mode="wait">
        {status === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'var(--gradient-lm)', opacity: 0.2 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: 'var(--gradient-card)' }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-10 h-10" style={{ color: '#8b5cf6' }} />
                </motion.div>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              Creating your wallet…
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Generating a secure Tempo blockchain wallet just for you.
            </p>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'var(--gradient-card)' }}
            >
              <CheckCircle className="w-12 h-12" style={{ color: '#10b981' }} />
            </motion.div>

            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              Wallet created!
            </h2>
            <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
              Your secure Tempo blockchain wallet is ready.
            </p>

            {/* Address display */}
            <div
              className="flex items-center justify-between px-4 py-3 rounded-2xl mb-4"
              style={{
                background: 'rgba(255,255,255,0.6)',
                border: '1.5px solid var(--color-border)',
              }}
            >
              <div className="text-left">
                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  Wallet address
                </p>
                <p className="font-mono font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                  {truncate(walletAddress)}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{ background: 'var(--gradient-card)' }}
              >
                {copied ? (
                  <Check className="w-4 h-4" style={{ color: '#10b981' }} />
                ) : (
                  <Copy className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                )}
              </button>
            </div>

            {/* Reassurance */}
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm"
              style={{
                background: 'rgba(196,181,253,0.1)',
                border: '1px solid rgba(196,181,253,0.3)',
              }}
            >
              <span>🔐</span>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Your private key is securely encrypted and stored. Signing happens server-side.
              </p>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              Something went wrong
            </h2>
            <p className="mb-6 text-sm" style={{ color: '#fb7185' }}>
              {errorMessage}
            </p>
            <button
              onClick={createWallet}
              className="w-full py-4 rounded-2xl font-semibold text-white"
              style={{ background: 'var(--gradient-lm)' }}
            >
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Step 5: Done ─────────────────────────────────────────────────────────────

function DoneStep({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="text-7xl mb-6 inline-block"
      >
        🎉
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
          You&apos;re all set!
        </h2>
        <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
          Your Admetos account and wallet are ready. Time to start sending and receiving
          stablecoins on Tempo.
        </p>

        <div className="space-y-2 mb-8">
          {['Profile created', 'Wallet generated', 'Ready to pay & get paid'].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-2xl text-left"
              style={{ background: 'rgba(255,255,255,0.5)' }}
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#10b981' }} />
              <span className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
                {item}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onFinish}
          className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2"
          style={{ background: 'var(--gradient-lm)' }}
        >
          <Sparkles className="w-4 h-4" />
          Take me to Admetos
        </motion.button>
      </motion.div>
    </div>
  )
}

// ─── Main Onboarding Page ────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()

  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    username: '',
    displayName: '',
    bio: '',
    accountType: 'personal',
  })
  const [walletResult, setWalletResult] = useState<WalletResult | null>(null)

  // Pre-fill display name from Clerk
  useEffect(() => {
    if (isLoaded && user) {
      const name =
        user.fullName ??
        [user.firstName, user.lastName].filter(Boolean).join(' ') ??
        ''
      if (name) setFormData((prev) => ({ ...prev, displayName: name }))
    }
  }, [isLoaded, user])

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  const patch = (update: Partial<FormData>) =>
    setFormData((prev) => ({ ...prev, ...update }))

  const handleWalletDone = (result: WalletResult) => {
    setWalletResult(result)
    // Auto-advance to done step after a moment
    setTimeout(() => go(5), 1200)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <WelcomeStep onNext={() => go(2)} />
      case 2:
        return (
          <UsernameStep
            value={formData.username}
            onChange={(v) => patch({ username: v })}
            onNext={() => go(3)}
          />
        )
      case 3:
        return <ProfileStep data={formData} onChange={patch} onNext={() => go(4)} />
      case 4:
        return <WalletStep data={formData} onDone={handleWalletDone} />
      case 5:
        return <DoneStep onFinish={() => router.push('/dashboard')} />
      default:
        return null
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <div className="w-full max-w-md">
        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* Step card */}
        <div
          className="glass rounded-3xl p-8 overflow-hidden"
          style={{ boxShadow: 'var(--shadow-xl)' }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Back link (steps 2-3 only) */}
        {step > 1 && step < 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-4"
          >
            <button
              onClick={() => go(step - 1)}
              className="text-sm transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-text-muted)' }}
            >
              ← Back
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
