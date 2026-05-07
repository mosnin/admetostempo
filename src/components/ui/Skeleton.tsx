'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'card' | 'list-item' | 'rect'
  lines?: number
  width?: string | number
  height?: string | number
}

function SkeletonBase({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('shimmer rounded-lg', className)}
      style={style}
      {...props}
    />
  )
}

function Skeleton({
  variant = 'text',
  lines = 1,
  width,
  height,
  className,
  ...props
}: SkeletonProps) {
  if (variant === 'circle') {
    return (
      <SkeletonBase
        className={cn('rounded-full', className)}
        style={{
          width: width ?? 40,
          height: height ?? width ?? 40,
        }}
        {...props}
      />
    )
  }

  if (variant === 'card') {
    return (
      <SkeletonBase
        className={cn('rounded-2xl', className)}
        style={{ width: width ?? '100%', height: height ?? 120 }}
        {...props}
      />
    )
  }

  if (variant === 'list-item') {
    return (
      <div className={cn('flex items-center gap-3 p-3', className)} {...props}>
        <SkeletonBase className="rounded-full h-10 w-10 shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <SkeletonBase className="h-3.5 w-1/3 rounded" />
          <SkeletonBase className="h-3 w-2/3 rounded" />
        </div>
        <SkeletonBase className="h-4 w-14 rounded" />
      </div>
    )
  }

  if (variant === 'rect') {
    return (
      <SkeletonBase
        className={cn('rounded-xl', className)}
        style={{ width: width ?? '100%', height: height ?? 48 }}
        {...props}
      />
    )
  }

  // text variant
  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          className="h-3.5 rounded"
          style={{ width: i === lines - 1 && lines > 1 ? '60%' : (width ?? '100%') }}
        />
      ))}
    </div>
  )
}

export { Skeleton }
