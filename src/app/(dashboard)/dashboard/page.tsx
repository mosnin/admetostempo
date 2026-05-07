import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard — Admetos',
}

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gradient mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome to Admetos</p>

      {/* Balance card placeholder */}
      <div className="card-pastel p-6 rounded-3xl mb-6">
        <p className="text-sm text-gray-500 mb-1">Total Balance</p>
        <p className="text-4xl font-bold text-gray-800">$0.00</p>
        <p className="text-sm text-mint-500 mt-1">pathUSD on Tempo Testnet</p>
      </div>

      {/* Quick actions placeholder */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <a
          href="/send"
          className="card-pastel p-4 rounded-2xl text-center hover:shadow-pastel-md transition-shadow"
        >
          <div className="text-2xl mb-2">→</div>
          <p className="font-semibold text-gray-700">Send</p>
        </a>
        <a
          href="/request"
          className="card-pastel p-4 rounded-2xl text-center hover:shadow-pastel-md transition-shadow"
        >
          <div className="text-2xl mb-2">←</div>
          <p className="font-semibold text-gray-700">Request</p>
        </a>
      </div>

      {/* Recent activity placeholder */}
      <div className="card-pastel p-6 rounded-3xl">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <p className="text-gray-400 text-center py-8">No recent activity</p>
      </div>
    </div>
  )
}
