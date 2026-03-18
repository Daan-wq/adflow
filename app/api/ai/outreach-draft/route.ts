import { NextRequest, NextResponse } from 'next/server'
import { anthropic, getModel } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
  page_id: z.string().uuid(),
  campaign_brief: z.string().min(10),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { page_id, campaign_brief } = schema.parse(body)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { data: page } = await supabase
      .from('pages')
      .select('handle, niche, communication_channel, contact_name')
      .eq('id', page_id)
      .single()

    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 })

    const channel = page.communication_channel ?? 'instagram'
    const toneMap: Record<string, string> = {
      whatsapp: 'casual and friendly, like a text message',
      telegram: 'casual and concise',
      instagram: 'casual and friendly, DM style',
      email: 'professional and polished',
      other: 'friendly and professional',
    }
    const tone = toneMap[channel] ?? toneMap.other

    const message = await anthropic.messages.create({
      model: getModel(),
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Write a short outreach message to an Instagram page owner to run an ad campaign. Tone: ${tone}. Max 4 sentences. Be direct — mention the campaign, ask if they're available, keep it natural.

Page: ${page.handle}
${page.contact_name ? `Contact: ${page.contact_name}` : ''}
Niche: ${page.niche ?? 'general'}
Channel: ${channel}
Campaign brief: ${campaign_brief}

Write only the message, no subject line or labels.`
      }]
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ message: text })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
