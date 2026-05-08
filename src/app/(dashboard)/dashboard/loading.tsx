import { Skeleton } from '@/components/ui/Skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Balance card skeleton */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6" style={{ background: 'linear-gradient(145deg, rgba(237,233,254,0.7) 0%, rgba(209,250,229,0.7) 100%)' }}>
        <Skeleton variant="text" className="w-32 h-4 mb-3" />
        <Skeleton variant="text" className="w-48 h-12 mb-6" />
        <div className="flex gap-3">
          <Skeleton variant="rect" className="flex-1 h-12 rounded-2xl" />
          <Skeleton variant="rect" className="flex-1 h-12 rounded-2xl" />
        </div>
      </div>

      {/* Activity header */}
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="w-32 h-5" />
        <Skeleton variant="text" className="w-14 h-4" />
      </div>

      {/* Transaction list skeleton */}
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3">
            <Skeleton variant="circle" width={44} height={44} />
            <div className="flex-1">
              <Skeleton variant="text" className="w-28 h-4 mb-2" />
              <Skeleton variant="text" className="w-40 h-3" />
            </div>
            <div className="text-right">
              <Skeleton variant="text" className="w-16 h-4 mb-1" />
              <Skeleton variant="text" className="w-10 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
