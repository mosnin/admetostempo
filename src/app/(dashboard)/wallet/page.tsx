export const metadata = {
  title: 'Wallet — Admetos',
}

export default function WalletPage() {
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-gradient mb-2">Wallet</h1>
      <p className="text-gray-500 mb-8">Your Tempo blockchain wallet</p>

      {/* Wallet address card */}
      <div className="card-pastel p-6 rounded-3xl mb-6">
        <p className="text-sm font-medium text-gray-500 mb-2">Wallet Address</p>
        <p className="font-mono text-sm text-gray-700 break-all mb-3">
          0x0000...0000
        </p>
        <div className="flex gap-2">
          <button className="flex-1 py-2 rounded-xl bg-lavender-100 text-lavender-600 text-sm font-medium hover:bg-lavender-200 transition-colors">
            Copy Address
          </button>
          <button className="flex-1 py-2 rounded-xl bg-mint-100 text-mint-600 text-sm font-medium hover:bg-mint-200 transition-colors">
            View on Explorer
          </button>
        </div>
      </div>

      {/* Balances */}
      <div className="card-pastel p-6 rounded-3xl mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Stablecoin Balances</h2>
        <div className="space-y-3">
          {[
            { symbol: 'pathUSD', color: 'lavender' },
            { symbol: 'AlphaUSD', color: 'mint' },
            { symbol: 'BetaUSD', color: 'peach' },
            { symbol: 'ThetaUSD', color: 'sky' },
          ].map(({ symbol }) => (
            <div key={symbol} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-lavender-200 flex items-center justify-center text-xs font-bold text-lavender-700">
                  {symbol[0]}
                </div>
                <span className="font-medium text-gray-700">{symbol}</span>
              </div>
              <span className="text-gray-400">0.00</span>
            </div>
          ))}
        </div>
      </div>

      {/* Receive section */}
      <div className="card-pastel p-6 rounded-3xl">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Receive Funds</h2>
        <p className="text-sm text-gray-500 mb-4">Share your address to receive payments</p>
        <button className="w-full py-3 rounded-2xl bg-gradient-lavender-mint text-white font-semibold hover:opacity-90 transition-opacity">
          Show QR Code
        </button>
      </div>
    </div>
  )
}
