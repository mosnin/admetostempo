'use client'
import { useMemo } from 'react'

// Simplified QR code visual — creates a branded placeholder with address
// In production, replace with a proper QR library like 'qrcode'
export function QRCode({ value, size = 200, className = '' }: {
  value: string; size?: number; className?: string
}) {
  const shortVal = value.slice(0, 8)

  // Generate deterministic cell pattern from the address
  const cells = useMemo(() => {
    const grid: boolean[][] = []
    for (let r = 0; r < 21; r++) {
      grid[r] = []
      for (let c = 0; c < 21; c++) {
        // Fixed corner finder patterns
        const inTopLeft = r < 7 && c < 7
        const inTopRight = r < 7 && c > 13
        const inBottomLeft = r > 13 && c < 7
        if (inTopLeft || inTopRight || inBottomLeft) {
          const ri = inTopLeft ? r : r > 13 ? r - 14 : r
          const ci = inTopRight ? c - 14 : c
          const isOuter = ri === 0 || ri === 6 || ci === 0 || ci === 6
          const isInner = ri >= 2 && ri <= 4 && ci >= 2 && ci <= 4
          grid[r][c] = isOuter || isInner
        } else {
          // Data area: derive from address chars
          const charIdx = (r * 21 + c) % value.length
          const charCode = value.charCodeAt(charIdx)
          grid[r][c] = (charCode + r + c) % 3 !== 0
        }
      }
    }
    return grid
  }, [value])

  const cellSize = size / 21

  return (
    <div className={`inline-block p-4 bg-white rounded-2xl shadow-lg ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="qr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6"/>
            <stop offset="100%" stopColor="#10B981"/>
          </linearGradient>
        </defs>
        {cells.map((row, r) =>
          row.map((on, c) => on ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize} y={r * cellSize}
              width={cellSize - 1} height={cellSize - 1}
              rx={1}
              fill="url(#qr-grad)"
            />
          ) : null)
        )}
      </svg>
      <p className="text-center text-xs text-slate-400 mt-2 font-mono">{value.slice(0, 6)}...{value.slice(-4)}</p>
    </div>
  )
}
