import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { MessageButton } from '@/components/shared/MessageButton'
import { formatCurrency } from '@/lib/utils/format'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Channel } from '@/lib/utils/communication'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: client }, { data: campaigns }, { data: payments }] = await Promise.all([
    supabase.from('clients').select('*').eq('id', id).single(),
    supabase.from('campaigns').select('id, name, status, client_pays, total_page_cost, your_margin, created_at').eq('client_id', id).order('created_at', { ascending: false }),
    supabase.from('payments').select('*').eq('client_id', id).order('created_at', { ascending: false }),
  ])

  if (!client) notFound()

  const completedCampaigns = (campaigns ?? []).filter(c => c.status === 'completed')
  const totalMargin = completedCampaigns.reduce((sum, c) => sum + Number(c.your_margin ?? 0), 0)
  const avgMarginPct = client.total_spent && Number(client.total_spent) > 0
    ? (totalMargin / Number(client.total_spent)) * 100
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">{client.name}</h1>
            <StatusBadge status={client.status} />
            {client.communication_handle && (
              <MessageButton
                channel={client.communication_channel as Channel}
                handle={client.communication_handle}
              />
            )}
          </div>
          {client.company && <p className="text-gray-500 mt-0.5">{client.company}</p>}
          {client.email && <p className="text-sm text-gray-400">{client.email}</p>}
        </div>
        <Link href={`/clients/${id}/edit`}>
          <Button variant="outline">Edit</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Spent', value: formatCurrency(Number(client.total_spent ?? 0)) },
          { label: 'Total Margin', value: formatCurrency(totalMargin) },
          { label: 'Avg Margin %', value: `${avgMarginPct.toFixed(1)}%` },
          { label: 'Campaigns', value: String(campaigns?.length ?? 0) },
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
          <TabsTrigger value="campaigns">Campaigns ({campaigns?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="payments">Payments ({payments?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-3">
          <div className="space-y-2">
            {(campaigns ?? []).length === 0 && (
              <p className="text-gray-400 text-sm py-4">No campaigns yet.</p>
            )}
            {(campaigns ?? []).map(c => (
              <Link
                key={c.id}
                href={`/campaigns/${c.id}`}
                className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">{c.name}</span>
                <div className="flex items-center gap-4">
                  <StatusBadge status={c.status} />
                  <span className="text-sm font-medium text-gray-700">
                    {formatCurrency(Number(c.your_margin ?? 0))} margin
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-3">
          <div className="space-y-2">
            {(payments ?? []).length === 0 && (
              <p className="text-gray-400 text-sm py-4">No payments yet.</p>
            )}
            {(payments ?? []).map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border bg-white">
                <div>
                  <p className="text-sm font-medium">{p.payment_method ?? 'Unknown method'}</p>
                  <p className="text-xs text-gray-400">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString('nl-NL') : '—'}
                    {p.due_date ? ` · Due ${new Date(p.due_date).toLocaleDateString('nl-NL')}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={p.status} />
                  <span className="font-semibold">{formatCurrency(Number(p.amount))}</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-3">
          <div className="p-4 rounded-lg border bg-white min-h-24">
            <p className="text-gray-600 whitespace-pre-wrap text-sm">
              {client.notes || 'No notes yet.'}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
