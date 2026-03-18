import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { MessageButton } from '@/components/shared/MessageButton'
import { formatCurrency } from '@/lib/utils/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CampaignStatusChanger } from './CampaignStatusChanger'
import type { Channel } from '@/lib/utils/communication'
import { cn } from '@/lib/utils'
import { AiSummaryButton } from '@/components/shared/AiSummaryButton'
import { SheetsSyncButton } from '@/components/shared/SheetsSyncButton'

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: campaign } = await supabase
    .from('campaigns')
    .select(`
      *,
      clients(id, name, communication_channel, communication_handle),
      campaign_pages(
        *,
        pages(id, handle, niche, communication_channel, communication_handle)
      )
    `)
    .eq('id', id)
    .single()

  if (!campaign) notFound()

  const marginPct = campaign.client_pays > 0
    ? ((campaign.your_margin ?? 0) / campaign.client_pays) * 100
    : 0

  const marginColor = marginPct < 10 ? 'text-red-600' : marginPct < 30 ? 'text-yellow-600' : 'text-green-600'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <StatusBadge status={campaign.status} />
          </div>
          {campaign.clients && (
            <p className="text-gray-500 mt-0.5">
              <Link href={`/clients/${campaign.clients.id}`} className="hover:underline">
                {campaign.clients.name}
              </Link>
            </p>
          )}
        </div>
        <CampaignStatusChanger campaignId={id} currentStatus={campaign.status} />
        <AiSummaryButton campaignId={id} />
        <SheetsSyncButton campaignId={id} />
      </div>

      {/* Money block */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">Financials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-400">Client Pays</p>
              <p className="text-xl font-bold">{formatCurrency(campaign.client_pays)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Page Costs</p>
              <p className="text-xl font-bold text-gray-600">{formatCurrency(campaign.total_page_cost ?? 0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Your Margin</p>
              <p className={cn('text-xl font-bold', marginColor)}>
                {formatCurrency(campaign.your_margin ?? 0)}
                <span className="text-sm font-normal ml-1">({marginPct.toFixed(1)}%)</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign pages */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Pages Assigned ({campaign.campaign_pages?.length ?? 0})</h2>
        {(campaign.campaign_pages ?? []).length === 0 && (
          <p className="text-gray-400 text-sm">No pages assigned.</p>
        )}
        {(campaign.campaign_pages ?? []).map((cp: any) => (
          <div key={cp.id} className="p-4 rounded-lg border bg-white">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{cp.pages?.handle ?? 'Unknown'}</span>
                {cp.pages?.niche && <span className="text-xs text-gray-400">{cp.pages.niche}</span>}
                <StatusBadge status={cp.status} />
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{formatCurrency(cp.cost)}</span>
                {cp.pages?.communication_handle && (
                  <MessageButton
                    channel={cp.pages.communication_channel as Channel}
                    handle={cp.pages.communication_handle}
                    prefill={`Hey! Quick update on the "${campaign.name}" campaign...`}
                  />
                )}
              </div>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Scheduled</p>
                <p>{cp.scheduled_date ? new Date(cp.scheduled_date).toLocaleDateString('nl-NL') : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Reach</p>
                <p>{cp.reach?.toLocaleString('nl-NL') ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Impressions</p>
                <p>{cp.impressions?.toLocaleString('nl-NL') ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Clicks</p>
                <p>{cp.clicks?.toLocaleString('nl-NL') ?? '—'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Results (if completed) */}
      {campaign.status === 'completed' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-sm">
              {[
                { label: 'Total Reach', value: campaign.total_reach?.toLocaleString('nl-NL') ?? '—' },
                { label: 'Impressions', value: campaign.total_impressions?.toLocaleString('nl-NL') ?? '—' },
                { label: 'Clicks', value: campaign.total_clicks?.toLocaleString('nl-NL') ?? '—' },
                { label: 'Conversions', value: campaign.total_conversions?.toLocaleString('nl-NL') ?? '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-lg font-bold">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {campaign.notes && (
        <div className="p-4 rounded-lg border bg-white">
          <p className="text-xs text-gray-400 mb-1">Notes</p>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{campaign.notes}</p>
        </div>
      )}

      {/* Dates */}
      {(campaign.start_date || campaign.end_date) && (
        <div className="flex gap-4 text-sm">
          {campaign.start_date && <span className="text-gray-500">Start: {new Date(campaign.start_date).toLocaleDateString('nl-NL')}</span>}
          {campaign.end_date && <span className="text-gray-500">End: {new Date(campaign.end_date).toLocaleDateString('nl-NL')}</span>}
        </div>
      )}
    </div>
  )
}
