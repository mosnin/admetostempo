import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function PublicProfileNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #d1fae5 50%, #ffedd5 100%)' }}>
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 max-w-sm mx-4 text-center shadow-xl">
        <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400 mb-4">404</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">User not found</h2>
        <p className="text-slate-500 mb-8">This profile doesn&apos;t exist or was removed.</p>
        <Link href="/explore"><Button variant="primary" className="w-full">Explore users</Button></Link>
      </div>
    </div>
  )
}
