'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact_name: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  communication_channel: z.string().min(1),
  communication_handle: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'paused', 'churned']),
})

export async function createClientAction(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)
  const parsed = clientSchema.safeParse(raw)
  if (!parsed.success) {
    const messages = parsed.error.issues.map(e => e.message).join(', ')
    throw new Error('Validation failed: ' + messages)
  }

  const { error } = await supabase.from('clients').insert(parsed.data)
  if (error) throw new Error(error.message)

  revalidatePath('/clients')
  redirect('/clients')
}

export async function updateClientAction(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)
  const parsed = clientSchema.safeParse(raw)
  if (!parsed.success) {
    const messages = parsed.error.issues.map(e => e.message).join(', ')
    throw new Error('Validation failed: ' + messages)
  }

  const { error } = await supabase.from('clients').update(parsed.data).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath(`/clients/${id}`)
  revalidatePath('/clients')
  redirect(`/clients/${id}`)
}
