import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { createClient } from '@/lib/supabase/server'
import { ProfileSection } from '@/components/settings/ProfileSection'

export const metadata = {
  title: 'Settings — Admetos',
}

export default async function SettingsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, bio, username, avatar_url')
    .eq('clerk_user_id', userId)
    .single()

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-gradient mb-8">Settings</h1>

      {/* Profile section */}
      {profile && (
        <ProfileSection
          initialProfile={{
            display_name: profile.display_name ?? '',
            bio: profile.bio ?? null,
            username: profile.username ?? '',
            avatar_url: profile.avatar_url ?? null,
          }}
        />
      )}

      {/* Account section */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Account</h2>
        <div className="card-pastel rounded-3xl divide-y divide-lavender-100">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Manage Account</p>
              <p className="text-xs text-gray-400">Email, password, linked accounts</p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Export Wallet</p>
              <p className="text-xs text-gray-400">Download your private key</p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
          <Link href="/settings/security" className="p-4 flex items-center justify-between hover:bg-lavender-50/50 transition-colors">
            <div>
              <p className="font-medium text-gray-700">Security</p>
              <p className="text-xs text-gray-400">2FA, sessions, scam protection</p>
            </div>
            <span className="text-gray-400">→</span>
          </Link>
          <Link href="/settings/api-keys" className="p-4 flex items-center justify-between hover:bg-lavender-50/50 transition-colors">
            <div>
              <p className="font-medium text-gray-700">API Keys</p>
              <p className="text-xs text-gray-400">Machine-to-machine payment keys</p>
            </div>
            <span className="text-gray-400">→</span>
          </Link>
          <Link href="/settings/business" className="p-4 flex items-center justify-between hover:bg-lavender-50/50 transition-colors rounded-b-3xl">
            <div>
              <p className="font-medium text-gray-700">Business Account</p>
              <p className="text-xs text-gray-400">Create or manage your business profile</p>
            </div>
            <span className="text-gray-400">→</span>
          </Link>
        </div>
      </section>

      {/* Notifications section */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Notifications</h2>
        <div className="card-pastel rounded-3xl divide-y divide-lavender-100">
          <Link href="/settings/notifications" className="p-4 flex items-center justify-between hover:bg-lavender-50/50 transition-colors rounded-3xl">
            <div>
              <p className="font-medium text-gray-700">Notification Preferences</p>
              <p className="text-xs text-gray-400">Payments, requests, followers, sounds</p>
            </div>
            <span className="text-gray-400">→</span>
          </Link>
        </div>
      </section>

      {/* Preferences section */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Preferences</h2>
        <div className="card-pastel rounded-3xl divide-y divide-lavender-100">
          {/* Language — uses LanguageSwitcher client component */}
          <div className="p-4 flex items-center justify-between">
            <p className="font-medium text-gray-700">Language</p>
            <LanguageSwitcher />
          </div>
          <div className="p-4 flex items-center justify-between">
            <p className="font-medium text-gray-700">Default Currency</p>
            <span className="text-gray-500 text-sm">pathUSD</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Dark Mode</p>
              <p className="text-xs text-gray-400">Switch between light and dark theme</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section>
        <h2 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-3">Danger Zone</h2>
        <div className="border border-rose-200 rounded-3xl p-4">
          <p className="font-medium text-gray-700 mb-1">Delete Account</p>
          <p className="text-xs text-gray-400 mb-3">
            Permanently delete your account and all data. This cannot be undone.
          </p>
          <button className="px-4 py-2 rounded-xl bg-rose-100 text-rose-600 text-sm font-medium hover:bg-rose-200 transition-colors">
            Delete Account
          </button>
        </div>
      </section>
    </div>
  )
}
