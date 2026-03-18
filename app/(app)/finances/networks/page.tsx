import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils/format'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NetworkCard } from './NetworkCard'
import { createNetworkAction } from '@/app/actions/finances'

export default async function NetworksPage() {
  const supabase = await createClient()
  const { data: networks } = await supabase.from('payment_networks').select('*').order('platform')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment Networks</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(networks ?? []).map(n => (
          <NetworkCard key={n.id} network={n} />
        ))}
      </div>

      <div className="border rounded-lg p-4 space-y-4 max-w-md">
        <h2 className="font-semibold">Add Network</h2>
        <form action={createNetworkAction} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Platform</Label>
              <select name="platform" className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                {['paypal', 'wise', 'revolut', 'bank', 'crypto', 'other'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="account_label">Label</Label>
              <Input id="account_label" name="account_label" placeholder="Main PayPal" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" name="currency" defaultValue="EUR" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="balance">Balance</Label>
              <Input id="balance" name="balance" type="number" step="0.01" defaultValue="0" />
            </div>
          </div>
          <Button type="submit" className="w-full">Add Network</Button>
        </form>
      </div>
    </div>
  )
}
