import { createClient } from '@/lib/supabase/server'
import { CampaignWizard } from './CampaignWizard'

export default async function NewCampaignPage() {
  const supabase = await createClient()

  const [{ data: clients }, { data: pages }] = await Promise.all([
    supabase.from('clients').select('id, name').eq('status', 'active').order('name'),
    supabase.from('pages').select('id, handle, niche, follower_count, avg_cpm, reliability_score, avg_engagement_rate').eq('status', 'active').order('handle'),
  ])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Campaign</h1>
      <CampaignWizard clients={clients ?? []} pages={pages ?? []} />
    </div>
  )
}
