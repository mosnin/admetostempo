'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfettiPieceProps {
  x: number
  delay: number
  color: string
  size: number
  rotation: number
}

function ConfettiPiece({ x, delay, color, size, rotation }: ConfettiPieceProps) {
  return (
    <motion.div
      style={{
        position: 'fixed',
        left: `${x}%`,
        top: -20,
        width: size,
        height: size * 0.4,
        backgroundColor: color,
        borderRadius: 2,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
      initial={{ y: -20, rotate: rotation, opacity: 1 }}
      animate={{
        y: ['0vh', '20vh', '60vh', '110vh'],
        rotate: [rotation, rotation + 180, rotation + 360, rotation + 540],
        x: [0, Math.random() * 60 - 30, Math.random() * 120 - 60, Math.random() * 80 - 40],
        opacity: [1, 1, 0.8, 0],
      }}
      transition={{ duration: 2.5 + Math.random(), delay, ease: 'easeIn' }}
    />
  )
}

const COLORS = ['#c4b5fd', '#6ee7b7', '#fed7aa', '#fda4af', '#67e8f9', '#fde68a', '#a5f3fc', '#d8b4fe']

interface ConfettiProps {
  active: boolean
  count?: number
}

export function Confetti({ active, count = 80 }: ConfettiProps) {
  const [pieces, setPieces] = useState<Array<{ id: number; x: number; delay: number; color: string; size: number; rotation: number }>>([])

  useEffect(() => {
    if (!active) { setPieces([]); return }
    const newPieces = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 8 + Math.random() * 12,
      rotation: Math.random() * 360,
    }))
    setPieces(newPieces)
    // Auto-cleanup after animation
    const timer = setTimeout(() => setPieces([]), 4000)
    return () => clearTimeout(timer)
  }, [active, count])

  return (
    <AnimatePresence>
      {pieces.map(piece => (
        <ConfettiPiece key={piece.id} {...piece} />
      ))}
    </AnimatePresence>
  )
}
