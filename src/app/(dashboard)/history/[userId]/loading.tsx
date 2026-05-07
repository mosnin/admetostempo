import { Skeleton } from '@/components/ui/Skeleton'

export default function ConversationLoading() {
  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 80px - 80px)' }}>
      {/* Header skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton variant="rect" className="w-9 h-9 rounded-xl" />
        <Skeleton variant="circle" width={40} height={40} />
        <div className="flex-1">
          <Skeleton variant="text" className="w-28 h-4 mb-1.5" />
          <Skeleton variant="text" className="w-20 h-3" />
        </div>
      </div>

      {/* Message bubbles skeleton — alternating left/right */}
      <div className="flex-1 space-y-3 pb-6">
        {[
          { align: 'start', width: 'w-48' },
          { align: 'end', width: 'w-40' },
          { align: 'start', width: 'w-56' },
          { align: 'end', width: 'w-36' },
          { align: 'start', width: 'w-44' },
          { align: 'end', width: 'w-52' },
        ].map((item, i) => (
          <div key={i} className={`flex justify-${item.align}`}>
            <Skeleton variant="rect" className={`h-14 rounded-3xl ${item.width}`} />
          </div>
        ))}
      </div>

      {/* Bottom action buttons skeleton */}
      <div className="flex gap-3 pt-4">
        <Skeleton variant="rect" className="flex-1 h-12 rounded-2xl" />
        <Skeleton variant="rect" className="flex-1 h-12 rounded-2xl" />
      </div>
    </div>
  )
}
