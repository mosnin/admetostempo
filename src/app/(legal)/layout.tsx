import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Footer } from '@/components/shared/Footer'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-emerald-50 to-orange-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Admetos
        </Link>
        {children}
        <Footer />
      </div>
    </div>
  )
}
