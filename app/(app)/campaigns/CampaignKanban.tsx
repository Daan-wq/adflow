'use client'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

interface Campaign {
  id: string
  name: string
  client_id: string | null
  status: string
  client_pays: number
  total_page_cost: number
  your_margin: number
  start_date: string | null
  end_date: string | null
  created_at: string | null
  clients?: { name: string } | null
}

const COLUMNS = ['draft', 'confirmed', 'scheduled', 'live', 'completed'] as const

function marginPct(campaign: Campaign): number {
  if (!campaign.client_pays || campaign.client_pays === 0) return 0
  return (campaign.your_margin / campaign.client_pays) * 100
}

function marginCardColor(pct: number): string {
  if (pct < 10) return 'border-l-4 border-l-red-400'
  if (pct < 30) return 'border-l-4 border-l-yellow-400'
  return 'border-l-4 border-l-green-400'
}

export function CampaignKanban({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {COLUMNS.map(status => {
        const cols = campaigns.filter(c => c.status === status)
        return (
          <div key={status} className="flex-shrink-0 w-60">
            <div className="flex items-center justify-between mb-2">
              <StatusBadge status={status} />
              <span className="text-xs text-gray-400">{cols.length}</span>
            </div>
            <div className="space-y-2">
              {cols.map(campaign => {
                const pct = marginPct(campaign)
                return (
                  <Link
                    key={campaign.id}
                    href={`/campaigns/${campaign.id}`}
                    className={cn(
                      'block p-3 rounded-lg bg-white border hover:shadow-sm transition-shadow',
                      marginCardColor(pct)
                    )}
                  >
                    <p className="font-medium text-sm leading-tight">{campaign.name}</p>
                    {campaign.clients?.name && (
                      <p className="text-xs text-gray-400 mt-0.5">{campaign.clients.name}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{formatCurrency(campaign.client_pays)}</span>
                      <span className={cn('text-xs font-semibold', pct < 10 ? 'text-red-600' : pct < 30 ? 'text-yellow-600' : 'text-green-600')}>
                        {pct.toFixed(0)}% margin
                      </span>
                    </div>
                  </Link>
                )
              })}
              {cols.length === 0 && (
                <div className="p-3 rounded-lg border border-dashed bg-gray-50 text-xs text-gray-400 text-center">
                  Empty
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
