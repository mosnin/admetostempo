import { Skeleton } from '@/components/ui/Skeleton'
export default function SettingsLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 space-y-4">
      <Skeleton variant="text" className="h-8 w-28" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} variant="card" className="h-32 rounded-2xl" />
      ))}
    </div>
  )
}
