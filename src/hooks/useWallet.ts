'use client'
import { useState, useCallback } from 'react'
import { usePublicClient, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { STABLECOIN_ADDRESS, TIP20_ABI } from '@/lib/tempo/chain'
import { useAppStore } from '@/store/useAppStore'
import { useProfile } from './useProfile'

const STABLECOINS = [
  { symbol: 'pathUSD', address: STABLECOIN_ADDRESS },
  // Additional stablecoin addresses to be configured via env
]

export function useWallet() {
  const publicClient = usePublicClient()
  const { profile } = useProfile()
  const { balances, setBalance } = useAppStore()
  const [isLoadingBalances, setIsLoadingBalances] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Wallet address from profile
  const address = profile?.wallet_address as `0x${string}` | undefined

  // Real-time primary stablecoin balance via wagmi useReadContract
  const { data: balanceRaw, isLoading: balanceLoading } = useReadContract({
    abi: TIP20_ABI,
    address: STABLECOIN_ADDRESS,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const balance = balanceRaw ? formatUnits(balanceRaw as bigint, 18) : '0'
  const formattedBalance = parseFloat(balance).toFixed(2)

  const fetchBalance = useCallback(
    async (walletAddress: `0x${string}`, tokenAddress: `0x${string}`) => {
      if (!publicClient) return '0'
      try {
        const raw = await publicClient.readContract({
          address: tokenAddress,
          abi: TIP20_ABI,
          functionName: 'balanceOf',
          args: [walletAddress],
        })
        return formatUnits(raw as bigint, 18)
      } catch {
        return '0'
      }
    },
    [publicClient]
  )

  const refreshBalances = useCallback(
    async (walletAddress: string) => {
      if (!walletAddress) return
      setIsLoadingBalances(true)
      setError(null)

      try {
        await Promise.all(
          STABLECOINS.map(async ({ symbol, address: tokenAddress }) => {
            const bal = await fetchBalance(walletAddress as `0x${string}`, tokenAddress)
            setBalance(symbol, bal)
          })
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch balances')
      } finally {
        setIsLoadingBalances(false)
      }
    },
    [fetchBalance, setBalance]
  )

  const copyAddress = useCallback((addr: string) => {
    navigator.clipboard.writeText(addr)
  }, [])

  const getExplorerUrl = useCallback((txHash: string) => {
    const explorerBase =
      process.env.NEXT_PUBLIC_TEMPO_EXPLORER_URL ?? 'https://explorer.testnet.tempo.xyz'
    return `${explorerBase}/tx/${txHash}`
  }, [])

  const getAddressExplorerUrl = useCallback((addr: string) => {
    const explorerBase =
      process.env.NEXT_PUBLIC_TEMPO_EXPLORER_URL ?? 'https://explorer.testnet.tempo.xyz'
    return `${explorerBase}/address/${addr}`
  }, [])

  return {
    // Primary stablecoin balance (live via wagmi)
    address,
    balance,
    balanceLoading,
    formattedBalance,

    // All token balances (refreshed manually)
    balances,
    isLoadingBalances,
    error,
    refreshBalances,
    copyAddress,
    getExplorerUrl,
    getAddressExplorerUrl,
  }
}
