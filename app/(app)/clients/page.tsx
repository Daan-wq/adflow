import { createClient } from '@/lib/supabase/server'
import { ClientsTable } from './ClientsTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('name')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Link href="/clients/new">
          <Button>Add Client</Button>
        </Link>
      </div>
      <ClientsTable clients={clients ?? []} />
    </div>
  )
}
