export const metadata = {
  title: 'Bridge — Admetos',
}

const CHAINS = [
  { id: 'tempo', name: 'Tempo Testnet' },
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'base', name: 'Base' },
  { id: 'arbitrum', name: 'Arbitrum' },
  { id: 'optimism', name: 'Optimism' },
  { id: 'polygon', name: 'Polygon' },
]

const TOKENS = ['pathUSD', 'AlphaUSD', 'BetaUSD', 'ThetaUSD', 'USDC', 'USDT']

export default function BridgePage() {
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-gradient mb-2">Bridge</h1>
      <p className="text-gray-500 mb-8">Move assets between Tempo and other chains</p>

      <div className="card-pastel p-6 rounded-3xl space-y-5">
        {/* From chain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Chain</label>
          <select className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-lavender-300">
            {CHAINS.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Swap arrow */}
        <div className="flex justify-center">
          <button className="w-10 h-10 rounded-full bg-lavender-100 flex items-center justify-center text-lavender-600 hover:bg-lavender-200 transition-colors">
            ↕
          </button>
        </div>

        {/* To chain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Chain</label>
          <select className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-lavender-300">
            {CHAINS.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Token */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Token</label>
          <select className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-lavender-300">
            {TOKENS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-lavender-300"
          />
        </div>

        {/* Bridge provider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bridge via</label>
          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded-xl border-2 border-lavender-400 text-lavender-600 text-sm font-medium">
              LayerZero
            </button>
            <button className="flex-1 py-2 rounded-xl border border-lavender-200 text-gray-500 text-sm font-medium hover:border-lavender-400">
              Relay
            </button>
          </div>
        </div>

        {/* Warning */}
        <div className="p-3 rounded-xl bg-peach-100 border border-peach-200">
          <p className="text-xs text-peach-700">
            ⚠️ Bridge transactions are irreversible. Double-check the destination chain and address before proceeding.
          </p>
        </div>

        <button className="w-full py-4 rounded-2xl bg-gradient-pastel border border-lavender-200 text-gray-700 font-semibold hover:shadow-pastel-md transition-shadow">
          Get Quote
        </button>
      </div>
    </div>
  )
}
