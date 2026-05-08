'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Product {
  id?: string
  name: string
  description: string
  price: string | number
  image_url?: string
  available?: boolean
  business_username?: string
}

const INITIALS_GRADIENTS = [
  'from-[#c4b5fd] to-[#a7f3d0]',
  'from-[#a7f3d0] to-[#fed7aa]',
  'from-[#fed7aa] to-[#fbcfe8]',
  'from-[#fde68a] to-[#c4b5fd]',
]

function getGradient(name: string) {
  return INITIALS_GRADIENTS[name.charCodeAt(0) % INITIALS_GRADIENTS.length]
}

export interface ProductCardProps {
  product: Product
  businessUsername?: string
  className?: string
  onPay?: (product: Product) => void
}

export function ProductCard({ product, businessUsername, className, onPay }: ProductCardProps) {
  const router = useRouter()
  const gradient = getGradient(product.name)
  const initials = product.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const username = businessUsername ?? product.business_username ?? ''
  const formattedPrice =
    typeof product.price === 'string' ? product.price : product.price.toFixed(2)

  function handlePay(e: React.MouseEvent) {
    e.stopPropagation()
    if (onPay) {
      onPay(product)
      return
    }
    const params = new URLSearchParams({
      to: username,
      amount: formattedPrice,
      memo: product.name,
    })
    router.push(`/send?${params}`)
  }

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(196,181,253,0.35)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'rounded-2xl overflow-hidden',
        'bg-white/70 backdrop-blur-[16px]',
        'border border-[rgba(196,181,253,0.2)]',
        'shadow-[0_4px_24px_rgba(196,181,253,0.15)]',
        !product.available && 'opacity-60',
        className
      )}
    >
      {/* Image or gradient placeholder */}
      {product.image_url ? (
        <div className="h-32 overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className={cn('h-24 bg-gradient-to-br flex items-center justify-center', gradient)}>
          <div className="w-12 h-12 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center text-white font-bold shadow-sm">
            {initials || <Package size={20} />}
          </div>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-bold text-[#1e1b4b] text-sm mb-0.5 line-clamp-1">{product.name}</h3>
        <p className="text-lg font-extrabold text-[#7c3aed] mb-1">
          ${formattedPrice}
          <span className="text-xs font-normal text-[#9ca3af] ml-1">pathUSD</span>
        </p>
        <p className="text-xs text-[#6b7280] line-clamp-2 mb-3 min-h-[2.4em]">
          {product.description}
        </p>

        {product.available === false ? (
          <div className="w-full py-2 rounded-xl bg-[#f3f4f6] text-center text-xs font-semibold text-[#9ca3af]">
            Unavailable
          </div>
        ) : (
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={handlePay}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-[#c4b5fd] to-[#a7f3d0] text-[#1e1b4b] text-xs font-semibold shadow-[0_2px_8px_rgba(196,181,253,0.35)] hover:opacity-90 transition-opacity"
          >
            Pay ${formattedPrice}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
