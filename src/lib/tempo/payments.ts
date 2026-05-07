import { createWalletClient, createPublicClient, http, parseUnits, formatUnits } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { tempoTestnet, TIP20_ABI, STABLECOIN_ADDRESS } from '@/lib/tempo/chain'
import { decryptPrivateKey } from '@/lib/wallet/generate'

export async function sendPayment({
  fromEncryptedKey,
  toAddress,
  amount,
  memo,
}: {
  fromEncryptedKey: string
  toAddress: string
  amount: string
  memo?: string
}): Promise<{ hash: string }> {
  const privateKey = decryptPrivateKey(fromEncryptedKey, process.env.WALLET_ENCRYPTION_KEY!)
  const account = privateKeyToAccount(privateKey as `0x${string}`)

  const walletClient = createWalletClient({
    account,
    chain: tempoTestnet,
    transport: http(process.env.NEXT_PUBLIC_TEMPO_RPC_URL),
  })

  const amountWei = parseUnits(amount, 18)

  // Use transferWithMemo if memo provided, else standard transfer
  const hash = await walletClient.writeContract({
    abi: TIP20_ABI,
    address: STABLECOIN_ADDRESS,
    functionName: memo ? 'transferWithMemo' : 'transfer',
    args: memo
      ? [toAddress as `0x${string}`, amountWei, memo]
      : [toAddress as `0x${string}`, amountWei],
  })

  return { hash }
}

export async function getBalance(address: string): Promise<string> {
  const publicClient = createPublicClient({
    chain: tempoTestnet,
    transport: http(process.env.NEXT_PUBLIC_TEMPO_RPC_URL),
  })

  const balanceRaw = await publicClient.readContract({
    abi: TIP20_ABI,
    address: STABLECOIN_ADDRESS,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  }) as bigint

  return formatUnits(balanceRaw, 18)
}
