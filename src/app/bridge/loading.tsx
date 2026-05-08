import { Skeleton } from '@/components/ui/Skeleton'
export default function BridgeLoading() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
      <Skeleton variant="text" className="h-8 w-32 mx-auto" />
      <Skeleton variant="rect" className="h-14 rounded-2xl" />
      <div className="flex items-center gap-2">
        <Skeleton variant="rect" className="h-14 flex-1 rounded-2xl" />
        <Skeleton variant="circle" className="w-10 h-10" />
        <Skeleton variant="rect" className="h-14 flex-1 rounded-2xl" />
      </div>
      <Skeleton variant="rect" className="h-32 rounded-2xl" />
      <Skeleton variant="rect" className="h-12 rounded-2xl" />
    </div>
  )
}
