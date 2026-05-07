import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { createPublicClient, http } from 'viem'
import { tempoTestnet } from '@/lib/tempo/chain'

export interface WalletData {
  address: string
  privateKey: string
  mnemonic?: string
}

export function generateWallet(): WalletData {
  const privateKey = generatePrivateKey()
  const account = privateKeyToAccount(privateKey)
  return {
    address: account.address,
    privateKey,
  }
}

export function getAccountFromPrivateKey(privateKey: string) {
  return privateKeyToAccount(privateKey as `0x${string}`)
}

export function encryptPrivateKey(privateKey: string, encryptionKey: string): string {
  // Simple XOR-based encryption for demo — in production use AES-256-GCM
  const keyBytes = Buffer.from(encryptionKey.padEnd(32, '0').slice(0, 32))
  const pkBytes = Buffer.from(privateKey)
  const encrypted = Buffer.alloc(pkBytes.length)
  for (let i = 0; i < pkBytes.length; i++) {
    encrypted[i] = pkBytes[i] ^ keyBytes[i % keyBytes.length]
  }
  return encrypted.toString('base64')
}

export function decryptPrivateKey(encryptedKey: string, encryptionKey: string): string {
  const keyBytes = Buffer.from(encryptionKey.padEnd(32, '0').slice(0, 32))
  const encrypted = Buffer.from(encryptedKey, 'base64')
  const decrypted = Buffer.alloc(encrypted.length)
  for (let i = 0; i < encrypted.length; i++) {
    decrypted[i] = encrypted[i] ^ keyBytes[i % keyBytes.length]
  }
  return decrypted.toString()
}

export const publicClient = createPublicClient({
  chain: tempoTestnet,
  transport: http(),
})
