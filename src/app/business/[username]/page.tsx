'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Building2, Globe, CheckCircle, ArrowLeft, Package } from 'lucide-react'
import { ProductCard, Product } from '@/components/business/ProductCard'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

const CATEGORY_COLORS: Record<string, string> = {
  food: 'bg-[#ffedd5] text-[#fb923c]',
  retail: 'bg-[#ede9fe] text-[#7c3aed]',
  services: 'bg-[#d1fae5] text-[#10b981]',
  entertainment: 'bg-[#fce7f3] text-[#db2777]',
  health: 'bg-[#e0f2fe] text-[#0ea5e9]',
  tech: 'bg-[#ede9fe] text-[#6d28d9]',
  travel: 'bg-[#d1fae5] text-[#059669]',
  beauty: 'bg-[#fce7f3] text-[#ec4899]',
  education: 'bg-[#ffedd5] text-[#d97706]',
}

const BANNER_GRADIENTS = [
  'from-[#c4b5fd] to-[#a7f3d0]',
  'from-[#a7f3d0] to-[#fed7aa]',
  'from-[#fed7aa] to-[#c4b5fd]',
  'from-[#fde68a] to-[#a7f3d0]',
  'from-[#c4b5fd] to-[#fbcfe8]',
]

function getBannerGradient(name: string) {
  return BANNER_GRADIENTS[name.charCodeAt(0) % BANNER_GRADIENTS.length]
}

interface BusinessData {
  id: string
  name: string
  username: string
  category: string
  description: string
  website?: string
  wallet_address?: string
  verified?: boolean
  banner_url?: string
  contact_email?: string
}

function BusinessSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton variant="rect" height={160} className="rounded-2xl" />
      <div className="px-1 space-y-3">
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" lines={2} />
        <Skeleton variant="rect" height={44} className="rounded-2xl" />
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="card" height={180} className="rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export default function BusinessProfilePage() {
  const params = useParams()
  const router = useRouter()
  const username = params?.username as string

  const [business, setBusiness] = React.useState<BusinessData | null>(null)
  const [products, setProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(true)
  const [notFound, setNotFound] = React.useState(false)

  React.useEffect(() => {
    if (!username) return
    setLoading(true)
    Promise.all([
      fetch(`/api/business/${username}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/business/${username}/products`).then((r) => (r.ok ? r.json() : { products: [] })),
    ])
      .then(([bizData, prodData]) => {
        if (!bizData) {
          setNotFound(true)
        } else {
          setBusiness(bizData.business ?? bizData)
          setProducts(prodData.products ?? [])
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [username])

  if (loading) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#7c3aed] font-medium"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <BusinessSkeleton />
      </div>
    )
  }

  if (notFound || !business) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🏪</p>
        <h2 className="text-xl font-bold text-[#1e1b4b] mb-2">Business Not Found</h2>
        <p className="text-[#6b7280] text-sm mb-6">
          @{username} doesn't exist or hasn't set up a business account.
        </p>
        <Button variant="ghost" onClick={() => router.push('/explore')}>
          Browse Explore
        </Button>
      </div>
    )
  }

  const bannerGradient = getBannerGradient(business.name)
  const initials = business.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  const categoryColor = CATEGORY_COLORS[business.category] ?? 'bg-[#ede9fe] text-[#7c3aed]'
  const availableProducts = products.filter((p) => p.available !== false)

  return (
    <div className="space-y-6">
      {/* Back button */}
      <motion.button
        type="button"
        onClick={() => router.back()}
        whileHover={{ x: -2 }}
        className="flex items-center gap-2 text-sm text-[#7c3aed] font-medium"
      >
        <ArrowLeft size={16} /> Back
      </motion.button>

      {/* Banner + identity */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="rounded-2xl overflow-hidden bg-white/70 border border-[rgba(196,181,253,0.2)] shadow-[0_4px_24px_rgba(196,181,253,0.18)]"
      >
        {/* Banner */}
        {business.banner_url ? (
          <div className="h-36 overflow-hidden">
            <img src={business.banner_url} alt="banner" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className={`h-36 bg-gradient-to-br ${bannerGradient}`} />
        )}

        <div className="px-5 pb-5">
          {/* Avatar — overlaps banner */}
          <div className="flex items-end justify-between -mt-8 mb-3">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-[0_4px_16px_rgba(196,181,253,0.3)] flex items-center justify-center text-xl font-bold text-[#7c3aed] border-2 border-white">
              {initials || <Building2 size={24} />}
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${categoryColor}`}
            >
              {business.category}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-[#1e1b4b]">{business.name}</h1>
            {business.verified && (
              <CheckCircle size={18} className="text-[#10b981] shrink-0" fill="currentColor" />
            )}
          </div>
          <p className="text-sm text-[#6b7280] mb-1">@{business.username}</p>
          <p className="text-sm text-[#4b5563] mb-4">{business.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#7c3aed] font-medium hover:underline"
              >
                <Globe size={12} /> {business.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {business.contact_email && (
              <a
                href={`mailto:${business.contact_email}`}
                className="text-xs text-[#6b7280] hover:text-[#7c3aed] transition-colors"
              >
                {business.contact_email}
              </a>
            )}
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => {
              const params = new URLSearchParams({
                to: business.username,
                memo: `Payment to ${business.name}`,
              })
              router.push(`/send?${params}`)
            }}
          >
            Pay {business.name}
          </Button>
        </div>
      </motion.div>

      {/* Products/Services */}
      {products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.08 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Package size={16} className="text-[#7c3aed]" />
            <h2 className="text-base font-bold text-[#1e1b4b]">Products & Services</h2>
            <span className="ml-auto text-xs text-[#9ca3af]">
              {availableProducts.length} available
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id ?? product.name}
                product={product}
                businessUsername={business.username}
              />
            ))}
          </div>
        </motion.div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-10 text-[#9ca3af] text-sm">
          No products listed yet.
        </div>
      )}
    </div>
  )
}
