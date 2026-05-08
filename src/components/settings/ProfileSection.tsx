'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { AvatarUpload } from './AvatarUpload'
import { EditProfileForm } from './EditProfileForm'

interface ProfileSectionProps {
  initialProfile: {
    display_name: string
    bio: string | null
    username: string
    avatar_url: string | null
  }
}

export function ProfileSection({ initialProfile }: ProfileSectionProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialProfile.avatar_url)

  async function handleSaveProfile(values: { display_name: string; bio: string; username: string }) {
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (!res.ok) throw new Error('Failed to save')
    toast.success('Profile updated!')
  }

  return (
    <section className="mb-6">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Profile</h2>
      <div className="card-pastel rounded-3xl p-6 space-y-6">
        <AvatarUpload
          currentUrl={avatarUrl}
          name={initialProfile.display_name}
          onUpload={url => setAvatarUrl(url)}
        />
        <EditProfileForm
          initialValues={{
            display_name: initialProfile.display_name,
            bio: initialProfile.bio,
            username: initialProfile.username,
          }}
          onSave={handleSaveProfile}
        />
      </div>
    </section>
  )
}
