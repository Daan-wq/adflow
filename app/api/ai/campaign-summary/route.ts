import { NextRequest, NextResponse } from 'next/server'
import { anthropic, getModel } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({ campaign_id: z.string().uuid() })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { campaign_id } = schema.parse(body)

    const supabase = await createClient()
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('*, clients(name), campaign_pages(cost, reach, impressions, clicks, pages(handle))')
      .eq('id', campaign_id)
      .single()

    if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })

    const pagesList = (campaign.campaign_pages ?? [])
      .map((cp: any) => `${cp.pages?.handle}: reach=${cp.reach ?? 'N/A'}, impressions=${cp.impressions ?? 'N/A'}, clicks=${cp.clicks ?? 'N/A'}`)
      .join('\n')

    const message = await anthropic.messages.create({
      model: getModel(),
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Write a concise, professional campaign performance summary for a client report. Keep it 2-3 sentences. Be specific about numbers. Tone: professional but friendly.

Campaign: ${campaign.name}
Client: ${campaign.clients?.name ?? 'Unknown'}
Total Reach: ${campaign.total_reach?.toLocaleString() ?? 'Not yet available'}
Total Impressions: ${campaign.total_impressions?.toLocaleString() ?? 'Not yet available'}
Total Clicks: ${campaign.total_clicks?.toLocaleString() ?? 'Not yet available'}
Pages:
${pagesList || 'No page data yet'}

Write only the summary, no preamble.`
      }]
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ summary: text })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
