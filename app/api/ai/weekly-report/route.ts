import { NextRequest, NextResponse } from 'next/server'
import { anthropic, getModel } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [{ data: completedCampaigns }, { data: pendingPayments }, { data: upcomingCampaigns }] = await Promise.all([
      supabase.from('campaigns').select('name, client_pays, your_margin, clients(name)').eq('status', 'completed').gte('updated_at', weekAgo),
      supabase.from('payments').select('direction, amount, due_date, clients(name), pages(handle)').eq('status', 'pending'),
      supabase.from('campaigns').select('name, start_date, status, clients(name)').in('status', ['confirmed', 'scheduled']).order('start_date'),
    ])

    const completedSummary = (completedCampaigns ?? [])
      .map((c: any) => `- ${c.name} (${c.clients?.name ?? '?'}): revenue €${c.client_pays}, margin €${c.your_margin ?? 0}`)
      .join('\n') || 'None'

    const pendingSummary = (pendingPayments ?? [])
      .map((p: any) => `- ${p.direction === 'incoming' ? 'IN' : 'OUT'} €${p.amount} ${p.direction === 'incoming' ? `from ${p.clients?.name ?? '?'}` : `to ${p.pages?.handle ?? '?'}`} (due ${p.due_date ?? 'no date'})`)
      .join('\n') || 'None'

    const upcomingSummary = (upcomingCampaigns ?? [])
      .map((c: any) => `- ${c.name} (${c.clients?.name ?? '?'}): ${c.status}, starts ${c.start_date ?? 'TBD'}`)
      .join('\n') || 'None'

    const message = await anthropic.messages.create({
      model: getModel(),
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `Write a concise weekly business report for an Instagram ad arbitrage operator. Focus on key numbers and action items. Max 200 words.

COMPLETED THIS WEEK:
${completedSummary}

PENDING PAYMENTS:
${pendingSummary}

UPCOMING CAMPAIGNS:
${upcomingSummary}

Format: 3 short sections (This Week, Pending, Coming Up). End with 2-3 bullet action items.`
      }]
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ report: text })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
