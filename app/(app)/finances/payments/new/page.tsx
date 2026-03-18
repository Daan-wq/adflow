import { logPaymentAction } from '@/app/actions/finances'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default async function LogPaymentPage() {
  const supabase = await createClient()
  const [{ data: clients }, { data: pages }, { data: campaigns }] = await Promise.all([
    supabase.from('clients').select('id, name').eq('status', 'active').order('name'),
    supabase.from('pages').select('id, handle').eq('status', 'active').order('handle'),
    supabase.from('campaigns').select('id, name').in('status', ['confirmed', 'scheduled', 'live']).order('name'),
  ])

  return (
    <div className="space-y-4 max-w-lg">
      <h1 className="text-2xl font-bold">Log Payment</h1>
      <form action={logPaymentAction} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Direction *</Label>
            <select name="direction" className="w-full border rounded-md px-3 py-2 text-sm bg-white">
              <option value="incoming">Incoming (client → you)</option>
              <option value="outgoing">Outgoing (you → page)</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input id="amount" name="amount" type="number" step="0.01" min="0" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Client</Label>
            <select name="client_id" className="w-full border rounded-md px-3 py-2 text-sm bg-white">
              <option value="">— none —</option>
              {(clients ?? []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Page</Label>
            <select name="page_id" className="w-full border rounded-md px-3 py-2 text-sm bg-white">
              <option value="">— none —</option>
              {(pages ?? []).map(p => <option key={p.id} value={p.id}>{p.handle}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Campaign</Label>
          <select name="campaign_id" className="w-full border rounded-md px-3 py-2 text-sm bg-white">
            <option value="">— none —</option>
            {(campaigns ?? []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Method</Label>
            <select name="payment_method" className="w-full border rounded-md px-3 py-2 text-sm bg-white">
              {['paypal', 'wise', 'revolut', 'bank', 'crypto', 'other'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input id="due_date" name="due_date" type="date" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="payment_reference">Reference</Label>
          <Input id="payment_reference" name="payment_reference" placeholder="Transaction ID, reference number..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={2} />
        </div>
        <Button type="submit" className="w-full">Log Payment</Button>
      </form>
    </div>
  )
}
