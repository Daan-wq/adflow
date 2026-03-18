import { NextRequest, NextResponse } from 'next/server'
import { anthropic, getModel } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
  client_pays: z.number().positive(),
  target_margin_pct: z.number().min(0).max(100),
  pages: z.array(z.object({
    page_id: z.string(),
    handle: z.string(),
    current_cost: z.number(),
  }))
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const totalCurrent = data.pages.reduce((s, p) => s + p.current_cost, 0)
    const targetCost = data.client_pays * (1 - data.target_margin_pct / 100)

    const message = await anthropic.messages.create({
      model: getModel(),
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `You are a cost negotiation advisor for an Instagram ad arbitrage business.

Client budget: €${data.client_pays}
Target margin: ${data.target_margin_pct}%
Target total page cost: €${targetCost.toFixed(2)}
Current total page cost: €${totalCurrent.toFixed(2)}

Pages and current costs:
${data.pages.map(p => `- ${p.handle}: currently €${p.current_cost}`).join('\n')}

Suggest how to redistribute the budget of €${targetCost.toFixed(2)} across these pages to hit the target margin. Be specific with numbers. Format as a brief list of recommendations.`
      }]
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ recommendations: text })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
