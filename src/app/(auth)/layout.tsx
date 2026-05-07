'use client'

import { motion } from 'framer-motion'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(135deg, #ede9fe 0%, #d1fae5 40%, #ffedd5 100%)',
        }}
        animate={{
          background: [
            'linear-gradient(135deg, #ede9fe 0%, #d1fae5 40%, #ffedd5 100%)',
            'linear-gradient(135deg, #d1fae5 0%, #ffedd5 40%, #ede9fe 100%)',
            'linear-gradient(135deg, #ffedd5 0%, #ede9fe 40%, #d1fae5 100%)',
            'linear-gradient(135deg, #ede9fe 0%, #d1fae5 40%, #ffedd5 100%)',
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Decorative blobs */}
      <div
        className="absolute top-[-6rem] right-[-6rem] w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'var(--gradient-lm)' }}
      />
      <div
        className="absolute bottom-[-6rem] left-[-6rem] w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'var(--gradient-mp)' }}
      />

      {/* Logo */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className="text-5xl font-bold text-gradient tracking-tight select-none">
          admetos
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Pay with Style on Tempo Blockchain
        </p>
      </motion.div>

      {/* Auth form */}
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  )
}
