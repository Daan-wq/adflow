'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const paymentSchema = z.object({
  direction: z.enum(['incoming', 'outgoing']),
  client_id: z.string().uuid().optional().or(z.literal('')),
  page_id: z.string().uuid().optional().or(z.literal('')),
  campaign_id: z.string().uuid().optional().or(z.literal('')),
  amount: z.string().transform(v => parseFloat(v)),
  currency: z.string().default('EUR'),
  payment_method: z.string().optional(),
  payment_reference: z.string().optional(),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']).default('pending'),
  due_date: z.string().optional(),
  notes: z.string().optional(),
})

export async function logPaymentAction(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)
  const parsed = paymentSchema.safeParse(raw)
  if (!parsed.success) {
    console.error('Validation failed:', parsed.error.issues)
    return
  }

  const data = {
    ...parsed.data,
    client_id: parsed.data.client_id || null,
    page_id: parsed.data.page_id || null,
    campaign_id: parsed.data.campaign_id || null,
  }

  const { error } = await supabase.from('payments').insert(data)
  if (error) {
    console.error('Error inserting payment:', error)
    return
  }

  revalidatePath('/finances')
  revalidatePath('/finances/payments')
}

export async function updatePaymentStatusAction(id: string, status: string): Promise<void> {
  const supabase = await createClient()
  const validStatuses = ['pending', 'completed', 'failed', 'refunded']
  if (!validStatuses.includes(status)) {
    console.error('Invalid status:', status)
    return
  }

  const updates: Record<string, unknown> = { status }
  if (status === 'completed') updates.paid_at = new Date().toISOString()

  const { error } = await supabase.from('payments').update(updates).eq('id', id)
  if (error) {
    console.error('Error updating payment status:', error)
    return
  }

  revalidatePath('/finances/payments')
}

export async function updateNetworkBalanceAction(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient()
  const balance = parseFloat(formData.get('balance') as string)
  if (isNaN(balance)) {
    console.error('Invalid balance')
    return
  }

  const { error } = await supabase.from('payment_networks').update({ balance }).eq('id', id)
  if (error) {
    console.error('Error updating network balance:', error)
    return
  }

  revalidatePath('/finances/networks')
}

export async function createNetworkAction(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('payment_networks').insert({
    platform: formData.get('platform') as string,
    account_label: formData.get('account_label') as string,
    currency: (formData.get('currency') as string) || 'EUR',
    balance: parseFloat(formData.get('balance') as string) || 0,
    notes: (formData.get('notes') as string) || null,
  })
  if (error) {
    console.error('Error creating network:', error)
    return
  }
  revalidatePath('/finances/networks')
}
