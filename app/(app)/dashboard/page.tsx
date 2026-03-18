import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { RevenueChart } from './RevenueChart'
import { CampaignStatusDonut } from './CampaignStatusDonut'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Parallel data fetching
  const [
    { data: campaigns },
    { data: recentPayments },
    { data: clients },
    { data: pages },
  ] = await Promise.all([
    supabase.from('campaigns').select('id, name, status, client_pays, total_page_cost, your_margin, created_at, clients(name)'),
    supabase.from('payments').select('id, direction, amount, status, created_at, clients(name), pages(handle)').order('created_at', { ascending: false }).limit(8),
    supabase.from('clients').select('id', { count: 'exact' }).eq('status', 'active'),
    supabase.from('pages').select('id', { count: 'exact' }).eq('status', 'active'),
  ])

  const allCampaigns = campaigns ?? []

  // KPI calculations
  const activeCampaigns = allCampaigns.filter(c => c.status === 'live').length
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const thisMonthCompleted = allCampaigns.filter(c => c.status === 'completed' && (c.created_at ?? '') >= monthStart)
  const revenueThisMonth = thisMonthCompleted.reduce((sum, c) => sum + Number(c.client_pays), 0)
  const marginThisMonth = thisMonthCompleted.reduce((sum, c) => sum + Number(c.your_margin ?? 0), 0)
  const marginPct = revenueThisMonth > 0 ? (marginThisMonth / revenueThisMonth) * 100 : 0

  const pendingIn = (recentPayments ?? []).filter(p => p.status === 'pending' && p.direction === 'incoming').length
  const pendingOut = (recentPayments ?? []).filter(p => p.status === 'pending' && p.direction === 'outgoing').length

  // Monthly revenue data for chart (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    const label = d.toLocaleDateString('nl-NL', { month: 'short', year: '2-digit' })
    const monthCampaigns = allCampaigns.filter(c =>
      c.status === 'completed' &&
      (c.created_at ?? '') >= d.toISOString() &&
      (c.created_at ?? '') < end.toISOString()
    )
    return {
      month: label,
      revenue: Number(monthCampaigns.reduce((sum, c) => sum + Number(c.client_pays), 0).toFixed(2)),
      margin: Number(monthCampaigns.reduce((sum, c) => sum + Number(c.your_margin ?? 0), 0).toFixed(2)),
    }
  })

  // Status distribution for donut
  const statusCounts = ['draft', 'confirmed', 'scheduled', 'live', 'completed', 'cancelled'].map(status => ({
    name: status,
    value: allCampaigns.filter(c => c.status === status).length,
  })).filter(s => s.value > 0)

  const kpis = [
    { label: 'Active Campaigns', value: String(activeCampaigns) },
    { label: 'Revenue (Month)', value: formatCurrency(revenueThisMonth) },
    { label: 'Margin (Month)', value: formatCurrency(marginThisMonth) },
    { label: 'Margin %', value: `${marginPct.toFixed(1)}%` },
    { label: 'Pending Payments', value: `${pendingIn} in / ${pendingOut} out` },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-400">{now.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {kpis.map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-1 pt-4">
              <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 flex-wrap">
        <Link href="/campaigns/new"><Button>+ New Campaign</Button></Link>
        <Link href="/clients/new"><Button variant="outline">+ New Client</Button></Link>
        <Link href="/pages/new"><Button variant="outline">+ New Page</Button></Link>
        <Link href="/finances/payments/new"><Button variant="outline">Log Payment</Button></Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Revenue vs Margin (6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={monthlyData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Campaigns by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <CampaignStatusDonut data={statusCounts} />
          </CardContent>
        </Card>
      </div>

      {/* Activity feed */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        <div className="rounded-md border bg-white divide-y">
          {(recentPayments ?? []).map((p: any) => (
            <div key={p.id} className="flex items-center justify-between p-3 text-sm">
              <div className="flex items-center gap-2">
                <span className={p.direction === 'incoming' ? 'text-green-600' : 'text-red-600'}>
                  {p.direction === 'incoming' ? '↓' : '↑'}
                </span>
                <span className="text-gray-600">
                  {p.direction === 'incoming' ? (p.clients?.name ?? 'Client') : (p.pages?.handle ?? 'Page')}
                </span>
                <StatusBadge status={p.status} />
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{formatCurrency(Number(p.amount))}</span>
                <span className="text-gray-400 text-xs">
                  {p.created_at ? new Date(p.created_at).toLocaleDateString('nl-NL') : ''}
                </span>
              </div>
            </div>
          ))}
          {(recentPayments ?? []).length === 0 && (
            <p className="text-center text-gray-400 py-6 text-sm">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  )
}
