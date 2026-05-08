import { Skeleton } from '@/components/ui/Skeleton'
export default function HistoryLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 space-y-3">
      <Skeleton variant="rect" className="h-10 rounded-2xl" />
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rect" className="h-8 w-20 rounded-full" />
        ))}
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} variant="list-item" className="h-16 rounded-2xl" />
      ))}
    </div>
  )
}
