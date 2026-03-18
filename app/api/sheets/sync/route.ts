import { NextRequest, NextResponse } from 'next/server'
import { getSheetsClient } from '@/lib/sheets/client'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
  campaign_id: z.string().uuid(),
  spreadsheet_id: z.string().min(1),
  sheet_name: z.string().default('Campaign Results'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { campaign_id, spreadsheet_id, sheet_name } = schema.parse(body)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { data: campaign } = await supabase
      .from('campaigns')
      .select(`
        name,
        status,
        start_date,
        end_date,
        total_reach,
        total_impressions,
        total_clicks,
        campaign_pages(
          status,
          scheduled_date,
          posted_at,
          reach,
          impressions,
          clicks
        )
      `)
      .eq('id', campaign_id)
      .single()

    if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })

    const sheets = getSheetsClient()

    // Build rows — client-safe data ONLY
    const headers = ['Campaign', 'Status', 'Start Date', 'End Date', 'Total Reach', 'Total Impressions', 'Total Clicks']
    const row = [
      campaign.name,
      campaign.status,
      campaign.start_date ?? '',
      campaign.end_date ?? '',
      String(campaign.total_reach ?? ''),
      String(campaign.total_impressions ?? ''),
      String(campaign.total_clicks ?? ''),
    ]

    // Try to update existing sheet, create header if needed
    const range = `${sheet_name}!A1`
    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheet_id,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers, row],
      },
    })

    return NextResponse.json({ success: true, rows_written: 2 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
