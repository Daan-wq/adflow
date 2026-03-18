import { createClient } from '@/lib/supabase/server'
import { CampaignsView } from './CampaignsView'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function CampaignsPage() {
  const supabase = await createClient()
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*, clients(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <Link href="/campaigns/new">
          <Button>New Campaign</Button>
        </Link>
      </div>
      <CampaignsView campaigns={campaigns ?? []} />
    </div>
  )
}
