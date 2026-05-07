'use client'

import * as React from 'react'
import * as RadixAvatar from '@radix-ui/react-avatar'
import { cn } from '@/lib/utils'

const sizeMap = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
  '2xl': 'h-24 w-24 text-2xl',
}

const gradientMap = [
  'from-[#c4b5fd] to-[#a7f3d0]',
  'from-[#a7f3d0] to-[#fed7aa]',
  'from-[#fed7aa] to-[#c4b5fd]',
  'from-[#a78bfa] to-[#6ee7b7]',
  'from-[#fdba74] to-[#a78bfa]',
]

function getGradient(name: string) {
  const idx = name.charCodeAt(0) % gradientMap.length
  return gradientMap[idx]
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export interface AvatarProps {
  src?: string
  name?: string
  size?: keyof typeof sizeMap
  className?: string
  alt?: string
}

function Avatar({ src, name = '', size = 'md', className, alt }: AvatarProps) {
  const gradient = getGradient(name)
  const initials = getInitials(name) || '?'

  return (
    <RadixAvatar.Root
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full',
        sizeMap[size],
        className
      )}
    >
      <RadixAvatar.Image
        src={src}
        alt={alt ?? name}
        className="aspect-square h-full w-full object-cover"
      />
      <RadixAvatar.Fallback
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br font-semibold text-[#1e1b4b]',
          gradient
        )}
        delayMs={200}
      >
        {initials}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}

export { Avatar }
