import { Skeleton } from '@/components/ui/Skeleton'

export default function PublicProfileLoading() {
  return (
    <div className="space-y-6">
      {/* Back button skeleton */}
      <Skeleton variant="text" className="w-16 h-5" />

      {/* Profile card skeleton */}
      <div className="rounded-2xl bg-white/70 border border-[rgba(196,181,253,0.2)] p-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <Skeleton variant="circle" width={96} height={96} />
          <Skeleton variant="text" className="w-40 h-7" />
          <Skeleton variant="text" className="w-28 h-4" />
          <Skeleton variant="text" className="w-64 h-4" />
          <Skeleton variant="text" className="w-48 h-4" />
          <div className="w-full space-y-3 pt-2">
            <Skeleton variant="rect" className="w-full h-12 rounded-2xl" />
            <Skeleton variant="rect" className="w-full h-12 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Recent activity skeleton */}
      <div>
        <Skeleton variant="text" className="w-32 h-4 mb-3" />
        <div className="rounded-2xl bg-white/70 border border-[rgba(196,181,253,0.2)] overflow-hidden divide-y divide-[#f3f0ff]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton variant="circle" width={32} height={32} />
              <div className="flex-1">
                <Skeleton variant="text" className="w-36 h-4 mb-1.5" />
                <Skeleton variant="text" className="w-20 h-3" />
              </div>
              <Skeleton variant="text" className="w-16 h-5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
