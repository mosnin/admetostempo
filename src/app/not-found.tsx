'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 via-emerald-50 to-orange-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }} className="text-center max-w-sm">
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} className="text-8xl mb-6">🔍</motion.div>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Page not found</h2>
        <p className="text-gray-500 mb-8 text-sm">This page doesn't exist or has been moved.</p>
        <Link href="/dashboard"><Button variant="primary" className="w-full">Back to home</Button></Link>
        <div className="mt-4 flex justify-center gap-6 text-sm text-gray-400">
          <Link href="/explore" className="hover:text-violet-500 transition-colors">Explore</Link>
          <Link href="/send" className="hover:text-violet-500 transition-colors">Send</Link>
          <Link href="/bridge" className="hover:text-violet-500 transition-colors">Bridge</Link>
        </div>
      </motion.div>
    </div>
  )
}
