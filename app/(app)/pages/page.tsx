import { createClient } from '@/lib/supabase/server'
import { PagesTable } from './PagesTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function PagesPage() {
  const supabase = await createClient()
  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('handle')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pages</h1>
        <Link href="/pages/new">
          <Button>Add Page</Button>
        </Link>
      </div>
      <PagesTable pages={pages ?? []} />
    </div>
  )
}
