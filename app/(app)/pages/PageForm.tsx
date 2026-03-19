'use client'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : label}
    </Button>
  )
}

interface Page {
  id: string
  handle: string
  niche: string | null
  follower_count: number | null
  avg_engagement_rate: number | null
  avg_cpm: number | null
  communication_channel: string
  communication_handle: string | null
  contact_name: string | null
  payment_method: string | null
  payment_details: string | null
  reliability_score: number | null
  notes: string | null
  status: string
  created_at: string | null
  updated_at: string | null
  page_link: string | null
  platform: string | null
  country: string | null
  audience_country_pct: Array<{ country: string; pct: number }> | null
  analytic_proof_url: string | null
}

interface PageFormProps {
  page?: Page
  action: (fd: FormData) => Promise<void>
}

export function PageForm({ page, action }: PageFormProps) {
  const [audienceRows, setAudienceRows] = useState<Array<{ country: string; pct: number }>>(
    page?.audience_country_pct ?? []
  )

  return (
    <form action={action} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="handle">Handle *</Label>
        <Input
          id="handle"
          name="handle"
          placeholder="@pagename"
          defaultValue={page?.handle ?? ''}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="niche">Niche</Label>
          <Input id="niche" name="niche" defaultValue={page?.niche ?? ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="follower_count">Follower Count</Label>
          <Input
            id="follower_count"
            name="follower_count"
            type="number"
            defaultValue={page?.follower_count ?? ''}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="avg_engagement_rate">Avg Engagement Rate (%)</Label>
          <Input
            id="avg_engagement_rate"
            name="avg_engagement_rate"
            type="number"
            step="0.01"
            defaultValue={page?.avg_engagement_rate ?? ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avg_cpm">Avg CPM</Label>
          <Input
            id="avg_cpm"
            name="avg_cpm"
            type="number"
            step="0.01"
            defaultValue={page?.avg_cpm ?? ''}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="communication_channel">Channel *</Label>
          <select
            name="communication_channel"
            defaultValue={page?.communication_channel ?? 'instagram'}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white"
          >
            {['instagram', 'whatsapp', 'telegram', 'email', 'other'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="communication_handle">Handle / Contact</Label>
          <Input
            id="communication_handle"
            name="communication_handle"
            defaultValue={page?.communication_handle ?? ''}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact_name">Contact Name</Label>
          <Input id="contact_name" name="contact_name" defaultValue={page?.contact_name ?? ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="payment_method">Payment Method</Label>
          <select
            name="payment_method"
            defaultValue={page?.payment_method ?? 'paypal'}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white"
          >
            {['paypal', 'wise', 'bank', 'crypto', 'revolut', 'other'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reliability_score">Reliability Score (1-10)</Label>
          <Input
            id="reliability_score"
            name="reliability_score"
            type="number"
            min="1"
            max="10"
            defaultValue={page?.reliability_score ?? '5'}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            name="status"
            defaultValue={page?.status ?? 'active'}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white"
          >
            {['active', 'paused', 'blacklisted'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Platform & Country */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <select
            name="platform"
            defaultValue={page?.platform ?? 'instagram'}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white"
          >
            {['instagram', 'tiktok', 'facebook', 'youtube', 'twitter', 'other'].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" placeholder="e.g. Netherlands" defaultValue={page?.country ?? ''} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="page_link">Page Link</Label>
        <Input id="page_link" name="page_link" type="url" placeholder="https://instagram.com/..." defaultValue={page?.page_link ?? ''} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="analytic_proof_url">Analytic Proof URL</Label>
        <Input id="analytic_proof_url" name="analytic_proof_url" type="url" placeholder="https://drive.google.com/..." defaultValue={page?.analytic_proof_url ?? ''} />
      </div>

      {/* Audience Country Breakdown */}
      <div className="space-y-2">
        <Label>Audience Country Breakdown</Label>
        {audienceRows.map((row, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              placeholder="Country code (e.g. NL)"
              value={row.country}
              onChange={e => setAudienceRows(rows => rows.map((r, idx) => idx === i ? { ...r, country: e.target.value } : r))}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="%"
              min="0"
              max="100"
              value={row.pct || ''}
              onChange={e => setAudienceRows(rows => rows.map((r, idx) => idx === i ? { ...r, pct: parseFloat(e.target.value) || 0 } : r))}
              className="w-20"
            />
            <button
              type="button"
              onClick={() => setAudienceRows(rows => rows.filter((_, idx) => idx !== i))}
              className="text-red-500 text-sm px-2 py-1 hover:bg-red-50 rounded"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setAudienceRows(rows => [...rows, { country: '', pct: 0 }])}
          className="text-sm text-gray-500 hover:text-gray-700 border border-dashed rounded px-3 py-1.5 w-full"
        >
          + Add country
        </button>
        <input type="hidden" name="audience_country_pct" value={JSON.stringify(audienceRows)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" defaultValue={page?.notes ?? ''} rows={3} />
      </div>
      <SubmitButton label={page ? 'Save Changes' : 'Create Page'} />
    </form>
  )
}
