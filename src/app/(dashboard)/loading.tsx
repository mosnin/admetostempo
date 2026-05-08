import { Skeleton } from '@/components/ui/Skeleton'
export default function DashboardLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 space-y-4">
      <Skeleton variant="card" className="h-40 rounded-3xl" />
      <div className="flex gap-3">
        <Skeleton variant="rect" className="h-12 flex-1 rounded-2xl" />
        <Skeleton variant="rect" className="h-12 flex-1 rounded-2xl" />
      </div>
      <div className="space-y-3 mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="list-item" className="h-16 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
