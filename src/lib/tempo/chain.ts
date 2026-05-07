import { defineChain } from 'viem'

export const tempoTestnet = defineChain({
  id: Number(process.env.NEXT_PUBLIC_TEMPO_CHAIN_ID ?? 270),
  name: 'Tempo Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'pathUSD',
    symbol: 'pUSD',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_TEMPO_RPC_URL ?? 'https://rpc.testnet.tempo.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tempo Explorer',
      url: process.env.NEXT_PUBLIC_TEMPO_EXPLORER_URL ?? 'https://explorer.testnet.tempo.xyz',
    },
  },
  testnet: true,
})

export const STABLECOIN_ADDRESS = (
  process.env.NEXT_PUBLIC_TEMPO_STABLECOIN_ADDRESS ?? '0x0000000000000000000000000000000000000000'
) as `0x${string}`

// TIP-20 ABI (ERC-20 compatible with memo support)
export const TIP20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'transferWithMemo',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'memo', type: 'string' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'symbol',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const
