'use client'
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
}

interface PageFormProps {
  page?: Page
  action: (fd: FormData) => Promise<void>
}

export function PageForm({ page, action }: PageFormProps) {
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
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" defaultValue={page?.notes ?? ''} rows={3} />
      </div>
      <SubmitButton label={page ? 'Save Changes' : 'Create Page'} />
    </form>
  )
}
