import { createClient } from '@/lib/supabase/server'
import { PaymentsList } from './PaymentsList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function PaymentsPage() {
  const supabase = await createClient()
  const { data: payments } = await supabase
    .from('payments')
    .select('*, clients(name), pages(handle), campaigns(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payments</h1>
        <Link href="/finances/payments/new">
          <Button>Log Payment</Button>
        </Link>
      </div>
      <PaymentsList payments={payments ?? []} />
    </div>
  )
}
