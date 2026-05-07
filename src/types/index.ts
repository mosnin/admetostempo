// ──────────────────────────────────────────────
// Core domain types for Admetos
// ──────────────────────────────────────────────

export interface Profile {
  id: string
  clerk_user_id: string
  username: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  wallet_address: string
  is_business: boolean
  created_at: string
  updated_at: string
}

export interface BusinessAccount {
  id: string
  profile_id: string
  business_name: string
  description: string | null
  category: string
  website: string | null
  username: string
  verified: boolean
  created_at: string
}

export interface Product {
  id: string
  business_id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  available: boolean
  created_at: string
}

export interface Transaction {
  id: string
  from_profile_id: string | null
  to_profile_id: string | null
  from_address: string
  to_address: string
  amount: number
  currency: string
  memo: string | null
  tx_hash: string | null
  status: 'pending' | 'confirmed' | 'failed'
  is_external: boolean
  created_at: string
  from_profile?: Profile
  to_profile?: Profile
}

export interface PaymentRequest {
  id: string
  from_profile_id: string
  to_profile_id: string
  amount: number
  memo: string | null
  status: 'pending' | 'paid' | 'declined'
  created_at: string
  from_profile?: Profile
  to_profile?: Profile
}

// ──────────────────────────────────────────────
// Stablecoin definitions
// ──────────────────────────────────────────────

export interface Stablecoin {
  symbol: 'pathUSD' | 'AlphaUSD' | 'BetaUSD' | 'ThetaUSD'
  name: string
  address: `0x${string}`
  decimals: number
  logoColor: string
}

// ──────────────────────────────────────────────
// Bridge types (LayerZero / Relay)
// ──────────────────────────────────────────────

export type BridgeProvider = 'layerzero' | 'relay'

export interface BridgeQuote {
  provider: BridgeProvider
  fromChain: string
  toChain: string
  fromToken: string
  toToken: string
  inputAmount: string
  outputAmount: string
  fee: string
  estimatedTime: string
  txData?: unknown
}

// ──────────────────────────────────────────────
// UI / App state types
// ──────────────────────────────────────────────

export type SendStep = 'select-recipient' | 'enter-amount' | 'add-memo' | 'confirm' | 'success'
export type RequestStep = 'select-sender' | 'enter-amount' | 'add-memo' | 'confirm'

export interface SendPayload {
  recipientUsername?: string
  recipientAddress?: string
  recipientProfile?: Profile
  amount: string
  currency: string
  memo: string
}

export interface RequestPayload {
  senderUsername?: string
  senderProfile?: Profile
  amount: string
  memo: string
}

// ──────────────────────────────────────────────
// Notification types
// ──────────────────────────────────────────────

export type NotificationType = 'payment_received' | 'payment_request' | 'request_paid' | 'request_declined'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  created_at: string
  related_transaction_id?: string
  related_request_id?: string
}

// ──────────────────────────────────────────────
// Explore / Feed types
// ──────────────────────────────────────────────

export interface FeedItem {
  id: string
  type: 'transaction' | 'request'
  actor: Profile
  target?: Profile
  amount: number
  currency: string
  memo: string | null
  created_at: string
  isPrivate?: boolean
}

// ──────────────────────────────────────────────
// Onboarding
// ──────────────────────────────────────────────

export type OnboardingStep =
  | 'welcome'
  | 'create-username'
  | 'create-wallet'
  | 'choose-type'
  | 'complete'

export interface OnboardingState {
  currentStep: OnboardingStep
  username: string
  displayName: string
  isBusiness: boolean
  walletAddress: string
  walletCreated: boolean
}

// ──────────────────────────────────────────────
// API response wrappers
// ──────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
