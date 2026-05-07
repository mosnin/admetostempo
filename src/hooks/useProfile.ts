'use client'
import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import type { Profile } from '@/types'
import { useAppStore } from '@/store/useAppStore'

export function useProfile() {
  const { user, isLoaded, isSignedIn } = useUser()
  const { profile, setProfile } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)

  const fetchProfile = useCallback(async () => {
    if (!isSignedIn) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/profile')
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to fetch profile')
      }

      if (json.needsOnboarding) {
        setNeedsOnboarding(true)
        return
      }

      setProfile(json.data as Profile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [isSignedIn, setProfile])

  useEffect(() => {
    if (isLoaded && isSignedIn && !profile) {
      fetchProfile()
    }
  }, [isLoaded, isSignedIn, profile, fetchProfile])

  const updateProfile = async (
    updates: Partial<Pick<Profile, 'display_name' | 'bio' | 'avatar_url' | 'username'>>
  ) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to update profile')
      }

      setProfile(json.data as Profile)
      return json.data as Profile
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return {
    profile,
    loading,
    // Legacy alias kept for backwards compatibility
    isLoading: loading,
    error,
    needsOnboarding,
    /** Re-fetches the profile from the API. */
    refetch: fetchProfile,
    fetchProfile,
    updateProfile,
  }
}
