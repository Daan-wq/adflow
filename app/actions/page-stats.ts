'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const pageStatSchema = z.object({
  page_id: z.string().uuid(),
  snapshot_date: z.string().min(1),
  followers_count: z.coerce.number().optional(),
  views_per_month: z.coerce.number().optional(),
  reach: z.coerce.number().optional(),
  accounts_engaged: z.coerce.number().optional(),
  profile_visits: z.coerce.number().optional(),
  bio_link_clicks: z.coerce.number().optional(),
  avg_watch_time_ms: z.coerce.number().optional(),
  likes: z.coerce.number().optional(),
  comments: z.coerce.number().optional(),
  saves: z.coerce.number().optional(),
  shares: z.coerce.number().optional(),
  engagement_rate: z.coerce.number().optional(),
  top_country_1: z.string().optional(),
  top_country_pct_1: z.coerce.number().optional(),
  top_country_2: z.string().optional(),
  top_country_pct_2: z.coerce.number().optional(),
  top_country_3: z.string().optional(),
  top_country_pct_3: z.coerce.number().optional(),
  age_13_17: z.coerce.number().optional(),
  age_18_24: z.coerce.number().optional(),
  age_25_34: z.coerce.number().optional(),
  age_35_44: z.coerce.number().optional(),
  age_45_54: z.coerce.number().optional(),
  age_55_64: z.coerce.number().optional(),
  age_65_plus: z.coerce.number().optional(),
  gender_male: z.coerce.number().optional(),
  gender_female: z.coerce.number().optional(),
})

export async function createPageStatAction(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)
  const parsed = pageStatSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues.map(e => e.message).join(', ') }
  }
  const { error } = await supabase.from('page_stats').upsert(parsed.data, { onConflict: 'page_id,snapshot_date' })
  if (error) return { error: error.message }
  revalidatePath(`/pages/${parsed.data.page_id}`)
  return {}
}

export async function deletePageStatAction(id: string, pageId: string): Promise<void> {
  const supabase = await createClient()
  await supabase.from('page_stats').delete().eq('id', id)
  revalidatePath(`/pages/${pageId}`)
}
