import { Skeleton } from '@/components/ui/Skeleton'
export default function ProfileLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-6">
      <div className="flex flex-col items-center gap-3 mb-6">
        <Skeleton variant="circle" className="w-24 h-24" />
        <Skeleton variant="text" className="h-6 w-32" />
        <Skeleton variant="text" className="h-4 w-24" />
        <Skeleton variant="text" className="h-4 w-48" />
      </div>
      <div className="flex gap-3 mb-6">
        <Skeleton variant="rect" className="h-10 flex-1 rounded-xl" />
        <Skeleton variant="rect" className="h-10 flex-1 rounded-xl" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="list-item" className="h-16 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
