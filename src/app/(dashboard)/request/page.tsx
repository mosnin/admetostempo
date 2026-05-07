export const metadata = {
  title: 'Request Payment — Admetos',
}

export default function RequestPage() {
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-gradient mb-2">Request</h1>
      <p className="text-gray-500 mb-8">Request stablecoins from someone</p>

      <div className="card-pastel p-6 rounded-3xl space-y-4">
        {/* From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Request from</label>
          <input
            type="text"
            placeholder="@username"
            className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-lavender-300"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              className="flex-1 px-4 py-3 rounded-2xl border border-lavender-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-lavender-300"
            />
            <select className="px-4 py-3 rounded-2xl border border-lavender-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-lavender-300">
              <option>pathUSD</option>
              <option>AlphaUSD</option>
              <option>BetaUSD</option>
              <option>ThetaUSD</option>
            </select>
          </div>
        </div>

        {/* Memo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What&apos;s it for? <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="Dinner, concert tickets, etc."
            className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-lavender-300"
          />
        </div>

        <button className="w-full py-4 rounded-2xl bg-gradient-mint-peach text-gray-800 font-semibold hover:opacity-90 transition-opacity">
          Send Request
        </button>
      </div>
    </div>
  )
}
