import { Skeleton } from '@/components/ui/Skeleton'

export default function WalletLoading() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-8 space-y-5">
      {/* Header */}
      <div>
        <Skeleton variant="text" className="w-32 h-8 mb-1" />
        <Skeleton variant="text" className="w-44 h-4" />
      </div>

      {/* Balance card skeleton */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6">
        <div className="flex items-center justify-between mb-1">
          <Skeleton variant="text" className="w-32 h-4" />
          <Skeleton variant="circle" width={28} height={28} />
        </div>
        <Skeleton variant="text" className="w-40 h-10 mb-3" />
        <div className="flex items-center gap-2">
          <Skeleton variant="rect" className="w-20 h-5 rounded-full" />
          <Skeleton variant="text" className="w-28 h-3" />
        </div>
      </div>

      {/* Quick action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Skeleton variant="rect" className="h-11 rounded-2xl" />
        <Skeleton variant="rect" className="h-11 rounded-2xl" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/60 rounded-2xl p-1">
        <Skeleton variant="rect" className="flex-1 h-9 rounded-xl" />
        <Skeleton variant="rect" className="flex-1 h-9 rounded-xl" />
      </div>

      {/* QR code area / receive tab skeleton */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center gap-4">
        <Skeleton variant="text" className="w-48 h-4" />
        <Skeleton variant="rect" className="w-48 h-48 rounded-2xl" />
        <div className="w-full">
          <Skeleton variant="rect" className="h-11 rounded-xl" />
        </div>
      </div>

      {/* Bridge CTA skeleton */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 flex items-center justify-between">
        <div className="flex-1">
          <Skeleton variant="text" className="w-36 h-4 mb-1.5" />
          <Skeleton variant="text" className="w-44 h-3" />
        </div>
        <Skeleton variant="circle" width={20} height={20} />
      </div>
    </div>
  )
}
