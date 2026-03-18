'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils/format'
import { updateNetworkBalanceAction } from '@/app/actions/finances'

interface Network {
  id: string
  platform: string
  account_label: string
  balance: number
  currency?: string | null
}

export function NetworkCard({ network }: { network: Network }) {
  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">{network.platform}</p>
          <p className="font-medium">{network.account_label}</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(Number(network.balance), network.currency ?? 'EUR')}</p>
        </div>
        <form
          action={async (fd) => {
            await updateNetworkBalanceAction(network.id, fd)
          }}
          className="flex gap-2"
        >
          <Input name="balance" type="number" step="0.01" defaultValue={String(network.balance)} className="text-sm" />
          <Button type="submit" size="sm" variant="outline">Update</Button>
        </form>
      </CardContent>
    </Card>
  )
}
