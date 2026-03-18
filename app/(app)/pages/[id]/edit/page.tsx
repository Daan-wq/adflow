import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PageForm } from '../../PageForm'
import { updatePageAction } from '@/app/actions/pages'

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: page } = await supabase.from('pages').select('*').eq('id', id).single()
  if (!page) notFound()

  const action = updatePageAction.bind(null, id)
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Page</h1>
      <PageForm page={page} action={action} />
    </div>
  )
}
