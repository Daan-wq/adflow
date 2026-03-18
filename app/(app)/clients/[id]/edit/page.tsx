import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ClientForm } from '../../ClientForm'
import { updateClientAction } from '@/app/actions/clients'

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: client } = await supabase.from('clients').select('*').eq('id', id).single()
  if (!client) notFound()

  const action = updateClientAction.bind(null, id)
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Client</h1>
      <ClientForm client={client} action={action} />
    </div>
  )
}
