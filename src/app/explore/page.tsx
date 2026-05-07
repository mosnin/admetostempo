export const metadata = {
  title: 'Explore — Admetos',
}

export default function ExplorePage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gradient mb-2">Explore</h1>
      <p className="text-gray-500 mb-6">Discover businesses and people on Admetos</p>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or username..."
          className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-lavender-300"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['All', 'Food & Dining', 'Retail', 'Services', 'Entertainment', 'Health', 'Technology'].map((cat) => (
          <button
            key={cat}
            className="px-4 py-2 rounded-full text-sm font-medium border border-lavender-200 text-gray-600 whitespace-nowrap hover:bg-lavender-100 transition-colors"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Public feed / business listings */}
      <div className="card-pastel p-12 rounded-3xl text-center">
        <p className="text-4xl mb-4">🌎</p>
        <p className="text-gray-500 font-medium">Nothing here yet</p>
        <p className="text-gray-400 text-sm mt-1">Be the first to join Admetos!</p>
      </div>
    </div>
  )
}
