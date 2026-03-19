'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const pageSchema = z.object({
  handle: z.string().min(1, 'Handle is required'),
  niche: z.string().optional(),
  follower_count: z.string().optional().transform(v => v ? parseInt(v) : null),
  avg_engagement_rate: z.string().optional().transform(v => v ? parseFloat(v) : null),
  avg_cpm: z.string().optional().transform(v => v ? parseFloat(v) : null),
  communication_channel: z.string().min(1),
  communication_handle: z.string().optional(),
  contact_name: z.string().optional(),
  payment_method: z.string().optional(),
  reliability_score: z.string().optional().transform(v => v ? parseInt(v) : 5),
  notes: z.string().optional(),
  status: z.enum(['active', 'paused', 'blacklisted']),
  page_link: z.string().url().optional().or(z.literal('')),
  platform: z.string().optional(),
  country: z.string().optional(),
  audience_country_pct: z.string().optional(),
  analytic_proof_url: z.string().url().optional().or(z.literal('')),
})

export async function createPageAction(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)
  const parsed = pageSchema.safeParse(raw)
  if (!parsed.success) {
    const messages = parsed.error.issues.map(e => e.message).join(', ')
    throw new Error('Validation failed: ' + messages)
  }

  const data = {
    ...parsed.data,
    audience_country_pct: parsed.data.audience_country_pct
      ? JSON.parse(parsed.data.audience_country_pct)
      : [],
  }

  const { error } = await supabase.from('pages').insert(data)
  if (error) throw new Error(error.message)

  revalidatePath('/pages')
  redirect('/pages')
}

export async function updatePageAction(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)
  const parsed = pageSchema.safeParse(raw)
  if (!parsed.success) {
    const messages = parsed.error.issues.map(e => e.message).join(', ')
    throw new Error('Validation failed: ' + messages)
  }

  const data = {
    ...parsed.data,
    audience_country_pct: parsed.data.audience_country_pct
      ? JSON.parse(parsed.data.audience_country_pct)
      : [],
  }

  const { error } = await supabase.from('pages').update(data).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath(`/pages/${id}`)
  revalidatePath('/pages')
  redirect(`/pages/${id}`)
}
