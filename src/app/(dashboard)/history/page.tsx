export const metadata = {
  title: 'Transaction History — Admetos',
}

export default function HistoryPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gradient mb-2">History</h1>
      <p className="text-gray-500 mb-8">Your transaction history</p>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['All', 'Sent', 'Received', 'Requests'].map((tab) => (
          <button
            key={tab}
            className="px-4 py-2 rounded-full text-sm font-medium border border-lavender-200 text-gray-600 hover:bg-lavender-100 transition-colors first:bg-lavender-300 first:text-white first:border-lavender-300"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="card-pastel p-12 rounded-3xl text-center">
        <p className="text-4xl mb-4">💸</p>
        <p className="text-gray-500 font-medium">No transactions yet</p>
        <p className="text-gray-400 text-sm mt-1">Your payment history will appear here</p>
        <a
          href="/send"
          className="inline-block mt-6 px-6 py-3 rounded-2xl bg-gradient-lavender-mint text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Send your first payment
        </a>
      </div>
    </div>
  )
}
