import { createClient } from '@/lib/supabase/server'
import { PagesTable } from './PagesTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function PagesPage() {
  const supabase = await createClient()
  const { data: pages } = await supabase.from('pages').select('*').order('handle')

  const { data: latestStats } = await supabase
    .from('page_stats')
    .select('page_id, views_per_month, reach, engagement_rate, snapshot_date')
    .order('snapshot_date', { ascending: false })

  // Build map: page_id → most recent stat row
  const statsMap = new Map<string, { views_per_month: number | null; reach: number | null; engagement_rate: number | null }>()
  for (const stat of latestStats ?? []) {
    if (!statsMap.has(stat.page_id)) {
      statsMap.set(stat.page_id, {
        views_per_month: stat.views_per_month,
        reach: stat.reach,
        engagement_rate: stat.engagement_rate,
      })
    }
  }

  const pagesWithStats = (pages ?? []).map(p => ({
    ...p,
    latest_views: statsMap.get(p.id)?.views_per_month ?? null,
    latest_reach: statsMap.get(p.id)?.reach ?? null,
    latest_engagement: statsMap.get(p.id)?.engagement_rate ?? null,
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pages</h1>
        <Link href="/pages/new">
          <Button>Add Page</Button>
        </Link>
      </div>
      <PagesTable pages={pagesWithStats} />
    </div>
  )
}
