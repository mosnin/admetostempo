import { create } from 'zustand'
import type { Profile } from '@/types'

// ──────────────────────────────────────────────
// Focused profile store — lightweight alternative
// to useAppStore for components that only need
// profile data (avoids subscribing to full app state).
// ──────────────────────────────────────────────

interface ProfileStore {
  profile: Profile | null
  setProfile: (p: Profile | null) => void
  clearProfile: () => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}))
