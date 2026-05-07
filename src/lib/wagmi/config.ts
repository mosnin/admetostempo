'use client'
import { createConfig, http } from 'wagmi'
import { tempoTestnet } from '@/lib/tempo/chain'
import { injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [tempoTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [tempoTestnet.id]: http(process.env.NEXT_PUBLIC_TEMPO_RPC_URL),
  },
})
