import { Skeleton } from '@/components/ui/skeleton'

export default function PagesLoading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-48" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-9 w-20" />)}
      </div>
      <div className="rounded-md border bg-white">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-14 rounded-full ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
