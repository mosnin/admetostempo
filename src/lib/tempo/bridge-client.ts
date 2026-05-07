// LayerZero and Relay bridge quote/execute helpers
// These call external bridge APIs

export type SupportedChain = 'tempo' | 'ethereum' | 'base' | 'arbitrum' | 'optimism' | 'polygon'

export interface BridgeQuoteParams {
  fromChain: SupportedChain
  toChain: SupportedChain
  token: string
  amount: string
  userAddress: string
}

export interface BridgeQuote {
  provider: 'layerzero' | 'relay'
  inputAmount: string
  outputAmount: string
  fee: string
  estimatedSeconds: number
  txData?: unknown
}

export async function getBridgeQuote(params: BridgeQuoteParams): Promise<BridgeQuote[]> {
  // In production: call LayerZero scan API and Relay API for quotes
  // For now, return mock quotes to demonstrate the UI
  return [
    {
      provider: 'layerzero',
      inputAmount: params.amount,
      outputAmount: (parseFloat(params.amount) * 0.999).toFixed(6),
      fee: (parseFloat(params.amount) * 0.001).toFixed(6),
      estimatedSeconds: 45,
    },
    {
      provider: 'relay',
      inputAmount: params.amount,
      outputAmount: (parseFloat(params.amount) * 0.9985).toFixed(6),
      fee: (parseFloat(params.amount) * 0.0015).toFixed(6),
      estimatedSeconds: 30,
    },
  ]
}

export const SUPPORTED_CHAINS: Record<SupportedChain, { name: string; chainId: number; logo: string }> = {
  tempo:     { name: 'Tempo',     chainId: 270,   logo: '⚡' },
  ethereum:  { name: 'Ethereum',  chainId: 1,     logo: '⟠' },
  base:      { name: 'Base',      chainId: 8453,  logo: '🔵' },
  arbitrum:  { name: 'Arbitrum',  chainId: 42161, logo: '🔷' },
  optimism:  { name: 'Optimism',  chainId: 10,    logo: '🔴' },
  polygon:   { name: 'Polygon',   chainId: 137,   logo: '🟣' },
}
