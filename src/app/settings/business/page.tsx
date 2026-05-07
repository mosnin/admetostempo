import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { CreateBusinessFormClient } from './CreateBusinessFormClient'

export const metadata = {
  title: 'Create Business — Admetos',
}

export default async function CreateBusinessPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1e1b4b] mb-1">Create a Business Account</h1>
        <p className="text-sm text-[#6b7280]">
          Set up your business on Admetos to accept payments, list products, and get discovered.
        </p>
      </div>

      {/* Info card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#ede9fe]/80 to-[#d1fae5]/80 border border-[rgba(196,181,253,0.25)] p-5">
        <p className="text-sm font-semibold text-[#1e1b4b] mb-1">What you get</p>
        <ul className="space-y-1.5 text-xs text-[#4b5563]">
          <li>✓ A public business profile page at admetos.xyz/business/yourname</li>
          <li>✓ A product catalog customers can browse and pay directly</li>
          <li>✓ Featured in the Explore page by category</li>
          <li>✓ AI agent payment API keys (for developers)</li>
        </ul>
      </div>

      {/* Form */}
      <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-[rgba(196,181,253,0.2)] shadow-[0_4px_24px_rgba(196,181,253,0.15)] p-6">
        <CreateBusinessFormClient />
      </div>
    </div>
  )
}
