import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, Transaction, PaymentRequest, Notification } from '@/types'

// ──────────────────────────────────────────────
// App-wide state
// ──────────────────────────────────────────────

interface AppState {
  // Profile
  profile: Profile | null
  setProfile: (profile: Profile | null) => void

  // Transactions
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void

  // Payment requests
  paymentRequests: PaymentRequest[]
  setPaymentRequests: (requests: PaymentRequest[]) => void

  // Notifications
  notifications: Notification[]
  setNotifications: (notifications: Notification[]) => void
  markNotificationRead: (id: string) => void
  unreadCount: number

  // UI state
  isSendModalOpen: boolean
  setSendModalOpen: (open: boolean) => void
  isRequestModalOpen: boolean
  setRequestModalOpen: (open: boolean) => void

  // Balances (keyed by token symbol)
  balances: Record<string, string>
  setBalance: (token: string, amount: string) => void

  // Reset
  reset: () => void
}

const initialState = {
  profile: null,
  transactions: [],
  paymentRequests: [],
  notifications: [],
  unreadCount: 0,
  isSendModalOpen: false,
  isRequestModalOpen: false,
  balances: {},
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setProfile: (profile) => set({ profile }),

      setTransactions: (transactions) => set({ transactions }),
      addTransaction: (transaction) =>
        set((state) => ({ transactions: [transaction, ...state.transactions] })),

      setPaymentRequests: (paymentRequests) => set({ paymentRequests }),

      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.read).length,
        }),
      markNotificationRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          }
        }),

      setSendModalOpen: (isSendModalOpen) => set({ isSendModalOpen }),
      setRequestModalOpen: (isRequestModalOpen) => set({ isRequestModalOpen }),

      setBalance: (token, amount) =>
        set((state) => ({ balances: { ...state.balances, [token]: amount } })),

      reset: () => set(initialState),
    }),
    {
      name: 'admetos-app-store',
      partialize: (state) => ({
        // Only persist non-sensitive UI preferences
        profile: state.profile,
      }),
    }
  )
)
