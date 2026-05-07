'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, RefreshCw } from 'lucide-react'

interface QRCodeProps {
  value: string
  size?: number
  className?: string
}

export function QRCode({ value, size = 200, className }: QRCodeProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Use QR Server API (free, no key needed)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&format=png&margin=10&color=7c3aed&bgcolor=faf5ff`

  function downloadQR() {
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = 'admetos-address.png'
    link.click()
  }

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.9 }}
        className="relative"
      >
        {!loaded && !error && (
          <div
            style={{ width: size, height: size }}
            className="rounded-2xl bg-gradient-to-br from-violet-100 to-emerald-100 animate-pulse flex items-center justify-center"
          >
            <RefreshCw className="w-8 h-8 text-violet-300 animate-spin" />
          </div>
        )}
        {error && (
          <div
            style={{ width: size, height: size }}
            className="rounded-2xl bg-violet-50 border-2 border-dashed border-violet-200 flex flex-col items-center justify-center gap-2 p-4"
          >
            <div className="text-xs text-center text-violet-400 font-mono break-all">{value.slice(0, 20)}...</div>
            <div className="text-xs text-gray-400">QR unavailable offline</div>
          </div>
        )}
        <img
          src={qrUrl}
          width={size}
          height={size}
          alt="Wallet QR Code"
          className="rounded-2xl shadow-lg"
          onLoad={() => setLoaded(true)}
          onError={() => { setError(true); setLoaded(true) }}
          style={{ display: loaded && !error ? 'block' : 'none' }}
        />
      </motion.div>
      {loaded && !error && (
        <button
          onClick={downloadQR}
          className="mt-3 flex items-center gap-1.5 text-xs text-violet-500 hover:text-violet-700 mx-auto transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download QR
        </button>
      )}
    </div>
  )
}
