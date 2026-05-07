import { Skeleton } from '@/components/ui/Skeleton'

export default function BusinessProfileLoading() {
  return (
    <div className="space-y-6">
      {/* Back button skeleton */}
      <Skeleton variant="text" className="w-16 h-5" />

      {/* Banner + identity card skeleton */}
      <div className="rounded-2xl bg-white/70 border border-[rgba(196,181,253,0.2)] overflow-hidden">
        {/* Banner */}
        <Skeleton variant="rect" className="h-36 rounded-none" />
        <div className="px-5 pb-5">
          {/* Avatar overlapping banner */}
          <div className="flex items-end justify-between -mt-8 mb-3">
            <Skeleton variant="rect" className="w-16 h-16 rounded-2xl" />
            <Skeleton variant="rect" className="w-20 h-6 rounded-full" />
          </div>
          <Skeleton variant="text" className="w-48 h-6 mb-1" />
          <Skeleton variant="text" className="w-28 h-4 mb-2" />
          <Skeleton variant="text" className="w-full h-4 mb-1" />
          <Skeleton variant="text" className="w-3/4 h-4 mb-4" />
          <Skeleton variant="rect" className="w-full h-12 rounded-2xl" />
        </div>
      </div>

      {/* Products grid skeleton */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton variant="circle" width={16} height={16} />
          <Skeleton variant="text" className="w-40 h-5" />
          <Skeleton variant="text" className="w-20 h-4 ml-auto" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="card" height={180} className="rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
