import { Skeleton } from '@/components/ui/Skeleton'
export default function SendLoading() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
      <Skeleton variant="text" className="h-8 w-40 mx-auto" />
      <Skeleton variant="rect" className="h-14 rounded-2xl" />
      <Skeleton variant="rect" className="h-24 rounded-2xl" />
      <Skeleton variant="rect" className="h-14 rounded-2xl" />
      <Skeleton variant="rect" className="h-12 rounded-2xl" />
    </div>
  )
}
