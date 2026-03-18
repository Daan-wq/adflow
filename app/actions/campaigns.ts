'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const campaignPageSchema = z.object({
  page_id: z.string().uuid(),
  cost: z.number().positive(),
  scheduled_date: z.string().optional(),
})

const createCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  client_id: z.string().uuid('Select a client'),
  client_pays: z.number().positive('Budget must be positive'),
  pages: z.array(campaignPageSchema).min(1, 'Select at least one page'),
  ad_content_url: z.string().url().optional().or(z.literal('')),
  ad_caption: z.string().optional(),
  ad_link: z.string().url().optional().or(z.literal('')),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

type CreateCampaignInput = z.infer<typeof createCampaignSchema>

export async function createCampaignAction(data: CreateCampaignInput) {
  const supabase = await createClient()
  const parsed = createCampaignSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues.map(e => e.message).join(', ') }

  const { pages, ...campaignData } = parsed.data
  const totalPageCost = pages.reduce((sum, p) => sum + p.cost, 0)

  // Insert campaign
  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .insert({
      ...campaignData,
      total_page_cost: totalPageCost,
      status: 'confirmed',
    })
    .select('id')
    .single()

  if (campaignError || !campaign) return { error: campaignError?.message ?? 'Failed to create campaign' }

  // Insert campaign_pages
  const { error: pagesError } = await supabase
    .from('campaign_pages')
    .insert(pages.map(p => ({
      campaign_id: campaign.id,
      page_id: p.page_id,
      cost: p.cost,
      scheduled_date: p.scheduled_date || null,
      status: 'pending',
    })))

  if (pagesError) return { error: pagesError.message }

  revalidatePath('/campaigns')
  redirect(`/campaigns/${campaign.id}`)
}

export async function updateCampaignStatusAction(id: string, status: string) {
  const supabase = await createClient()
  const validStatuses = ['draft', 'confirmed', 'scheduled', 'live', 'completed', 'cancelled']
  if (!validStatuses.includes(status)) return { error: 'Invalid status' }

  const { error } = await supabase.from('campaigns').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath(`/campaigns/${id}`)
  revalidatePath('/campaigns')
}
