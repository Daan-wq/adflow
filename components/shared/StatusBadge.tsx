import { cn } from '@/lib/utils'

const statusStyles: Record<string, string> = {
  // Campaign statuses
  draft: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-purple-100 text-purple-700',
  live: 'bg-green-100 text-green-700',
  completed: 'bg-gray-200 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
  // Client / Page statuses
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  churned: 'bg-gray-200 text-gray-600',
  blacklisted: 'bg-red-100 text-red-700',
  // Payment statuses
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-orange-100 text-orange-700',
  // Campaign page statuses
  posted: 'bg-blue-100 text-blue-700',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize',
      statusStyles[status] ?? 'bg-gray-100 text-gray-700'
    )}>
      {status}
    </span>
  )
}
