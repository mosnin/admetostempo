import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Profile — Admetos',
}

export default async function ProfilePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="p-6 max-w-lg mx-auto">
      {/* Profile header */}
      <div className="card-pastel p-6 rounded-3xl mb-6 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-lavender-mint mx-auto mb-4 flex items-center justify-center text-4xl">
          👤
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Your Name</h1>
        <p className="text-lavender-500 font-medium mb-2">@username</p>
        <p className="text-gray-400 text-sm mb-4">Bio goes here</p>
        <div className="flex justify-center gap-4 text-sm text-gray-500">
          <span><strong className="text-gray-700">0</strong> transactions</span>
        </div>
      </div>

      {/* Edit profile */}
      <div className="card-pastel p-6 rounded-3xl mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Edit Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              placeholder="Your display name"
              className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-lavender-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              placeholder="@username"
              className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-lavender-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              placeholder="Tell people about yourself..."
              rows={3}
              maxLength={160}
              className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-lavender-300 resize-none"
            />
          </div>
          <button className="w-full py-3 rounded-2xl bg-gradient-lavender-mint text-white font-semibold hover:opacity-90 transition-opacity">
            Save Changes
          </button>
        </div>
      </div>

      {/* Wallet info */}
      <div className="card-pastel p-6 rounded-3xl">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Wallet</h2>
        <p className="text-sm text-gray-500 mb-2">Wallet Address</p>
        <p className="font-mono text-xs text-gray-600 break-all mb-3">0x0000...0000</p>
        <a href="/wallet" className="text-lavender-500 text-sm font-medium hover:text-lavender-600">
          Manage wallet →
        </a>
      </div>
    </div>
  )
}
