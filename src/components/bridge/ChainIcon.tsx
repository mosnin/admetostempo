'use client'

export type ChainId = 'tempo' | 'ethereum' | 'base' | 'arbitrum' | 'optimism' | 'polygon' | 'bnb'

export interface ChainInfo {
  id: ChainId
  name: string
  logo: string
  chainId: number
}

export const CHAINS: ChainInfo[] = [
  { id: 'tempo',    name: 'Tempo',     logo: '⚡', chainId: 270 },
  { id: 'ethereum', name: 'Ethereum',  logo: '⟠',  chainId: 1 },
  { id: 'base',     name: 'Base',      logo: '🔵', chainId: 8453 },
  { id: 'arbitrum', name: 'Arbitrum',  logo: '🔷', chainId: 42161 },
  { id: 'optimism', name: 'Optimism',  logo: '🔴', chainId: 10 },
  { id: 'polygon',  name: 'Polygon',   logo: '🟣', chainId: 137 },
  { id: 'bnb',      name: 'BNB Chain', logo: '🟡', chainId: 56 },
]

export const CHAIN_MAP: Record<ChainId, ChainInfo> = Object.fromEntries(
  CHAINS.map((c) => [c.id, c])
) as Record<ChainId, ChainInfo>

interface ChainIconProps {
  chainId: ChainId
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  className?: string
}

export function ChainIcon({ chainId, size = 'md', showName = false, className = '' }: ChainIconProps) {
  const chain = CHAIN_MAP[chainId]
  if (!chain) return null

  const emojiSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'
  const nameSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={emojiSize}>{chain.logo}</span>
      {showName && (
        <span className={`font-medium text-gray-700 ${nameSize}`}>{chain.name}</span>
      )}
    </span>
  )
}
