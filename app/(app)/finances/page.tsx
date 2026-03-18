import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function FinancesPage() {
  const supabase = await createClient()

  const [
    { data: pendingIn },
    { data: pendingOut },
    { data: networks },
    { data: recentPayments },
    { data: topClients },
  ] = await Promise.all([
    supabase.from('payments').select('amount').eq('status', 'pending').eq('direction', 'incoming'),
    supabase.from('payments').select('amount').eq('status', 'pending').eq('direction', 'outgoing'),
    supabase.from('payment_networks').select('*').order('platform'),
    supabase.from('payments').select('*, clients(name), pages(handle)').order('created_at', { ascending: false }).limit(10),
    supabase.from('client_profitability').select('*').limit(5),
  ])

  const totalPendingIn = (pendingIn ?? []).reduce((sum, p) => sum + Number(p.amount), 0)
  const totalPendingOut = (pendingOut ?? []).reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Finances</h1>
        <div className="flex gap-2">
          <Link href="/finances/payments">
            <Button variant="outline">All Payments</Button>
          </Link>
          <Link href="/finances/networks">
            <Button variant="outline">Networks</Button>
          </Link>
        </div>
      </div>

      {/* Pending payments */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-700">Clients Owe You</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(totalPendingIn)}</p>
            <p className="text-xs text-gray-400 mt-1">{pendingIn?.length ?? 0} pending payments</p>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-700">You Owe Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-700">{formatCurrency(totalPendingOut)}</p>
            <p className="text-xs text-gray-400 mt-1">{pendingOut?.length ?? 0} pending payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment network balances */}
      {(networks ?? []).length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Payment Networks</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(networks ?? []).map(n => (
              <Card key={n.id}>
                <CardContent className="pt-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{n.platform}</p>
                  <p className="font-medium text-sm">{n.account_label}</p>
                  <p className="text-xl font-bold mt-1">{formatCurrency(Number(n.balance), n.currency ?? 'EUR')}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Top clients */}
      {(topClients ?? []).length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Top Clients by Margin</h2>
          <div className="rounded-md border bg-white divide-y">
            {(topClients ?? []).map((c: any, i: number) => (
              <div key={c.id} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm font-mono w-5">#{i + 1}</span>
                  <span className="font-medium">{c.name}</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-green-600">{formatCurrency(Number(c.total_margin))}</span>
                  <span className="text-gray-400 ml-2">{c.total_campaigns} campaigns</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent payments */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Payments</h2>
        <div className="rounded-md border bg-white divide-y">
          {(recentPayments ?? []).map((p: any) => (
            <div key={p.id} className="flex items-center justify-between p-3 text-sm">
              <div>
                <span className={p.direction === 'incoming' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {p.direction === 'incoming' ? '↓ In' : '↑ Out'}
                </span>
                <span className="text-gray-500 ml-2">
                  {p.direction === 'incoming' ? (p.clients?.name ?? 'Client') : (p.pages?.handle ?? 'Page')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={p.status} />
                <span className="font-semibold">{formatCurrency(Number(p.amount))}</span>
              </div>
            </div>
          ))}
          {(recentPayments ?? []).length === 0 && (
            <p className="text-center text-gray-400 py-6 text-sm">No payments yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
