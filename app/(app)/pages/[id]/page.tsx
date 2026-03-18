import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { MessageButton } from '@/components/shared/MessageButton'
import { formatCurrency, formatNumber } from '@/lib/utils/format'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Channel } from '@/lib/utils/communication'

export default async function PageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: page }, { data: campaignPages }] = await Promise.all([
    supabase.from('pages').select('*').eq('id', id).single(),
    supabase
      .from('campaign_pages')
      .select('*, campaigns(id, name, status, created_at)')
      .eq('page_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!page) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">{page.handle}</h1>
            <StatusBadge status={page.status} />
            {page.communication_handle && (
              <MessageButton
                channel={page.communication_channel as Channel}
                handle={page.communication_handle}
              />
            )}
          </div>
          {page.niche && <p className="text-gray-500 mt-0.5">Niche: {page.niche}</p>}
          {page.contact_name && <p className="text-sm text-gray-400">Contact: {page.contact_name}</p>}
        </div>
        <Link href={`/pages/${id}/edit`}>
          <Button variant="outline">Edit</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Followers', value: page.follower_count ? formatNumber(page.follower_count) : '—' },
          { label: 'Engagement', value: page.avg_engagement_rate ? `${page.avg_engagement_rate.toFixed(2)}%` : '—' },
          { label: 'Avg CPM', value: page.avg_cpm ? formatCurrency(page.avg_cpm) : '—' },
          { label: 'Reliability', value: page.reliability_score ? `${page.reliability_score}/10` : '—' },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-1 pt-4">
              <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns ({campaignPages?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-3">
          <div className="space-y-2">
            {(campaignPages ?? []).length === 0 && (
              <p className="text-gray-400 text-sm py-4">No campaigns yet.</p>
            )}
            {(campaignPages ?? []).map((cp: any) => (
              <Link
                key={cp.id}
                href={`/campaigns/${cp.campaigns?.id}`}
                className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">{cp.campaigns?.name}</span>
                <div className="flex items-center gap-4">
                  <StatusBadge status={cp.campaigns?.status} />
                  <span className="text-xs text-gray-400">
                    {cp.campaigns?.created_at
                      ? new Date(cp.campaigns.created_at).toLocaleDateString('nl-NL')
                      : '—'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-3">
          <div className="p-4 rounded-lg border bg-white min-h-24">
            <p className="text-gray-600 whitespace-pre-wrap text-sm">
              {page.notes || 'No notes yet.'}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
