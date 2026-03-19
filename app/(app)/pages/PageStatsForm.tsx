'use client'
import { useRef, useState } from 'react'
import { createPageStatAction } from '@/app/actions/page-stats'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  pageId: string
  onSuccess?: () => void
}

export function PageStatsForm({ pageId, onSuccess }: Props) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(formRef.current!)
    fd.set('page_id', pageId)
    const result = await createPageStatAction(fd)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      formRef.current?.reset()
      onSuccess?.()
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="snapshot_date">Snapshot Date *</Label>
          <Input id="snapshot_date" name="snapshot_date" type="date" required
            defaultValue={new Date().toISOString().split('T')[0]} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="followers_count">Followers</Label>
          <Input id="followers_count" name="followers_count" type="number" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="views_per_month">Views / Month</Label>
          <Input id="views_per_month" name="views_per_month" type="number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reach">Reach</Label>
          <Input id="reach" name="reach" type="number" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="accounts_engaged">Accounts Engaged</Label>
          <Input id="accounts_engaged" name="accounts_engaged" type="number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile_visits">Profile Visits</Label>
          <Input id="profile_visits" name="profile_visits" type="number" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bio_link_clicks">Bio Link Clicks</Label>
          <Input id="bio_link_clicks" name="bio_link_clicks" type="number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avg_watch_time_ms">Avg Watch Time (ms)</Label>
          <Input id="avg_watch_time_ms" name="avg_watch_time_ms" type="number" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {(['likes', 'comments', 'saves', 'shares'] as const).map(f => (
          <div key={f} className="space-y-2">
            <Label htmlFor={f} className="capitalize">{f}</Label>
            <Input id={f} name={f} type="number" />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="engagement_rate">Engagement Rate (%)</Label>
        <Input id="engagement_rate" name="engagement_rate" type="number" step="0.01" className="max-w-xs" />
      </div>

      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide pt-2">Top Countries</p>
      {([1, 2, 3] as const).map(n => (
        <div key={n} className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor={`top_country_${n}`} className="text-xs">Country {n}</Label>
            <Input id={`top_country_${n}`} name={`top_country_${n}`} placeholder="e.g. NL" />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`top_country_pct_${n}`} className="text-xs">%</Label>
            <Input id={`top_country_pct_${n}`} name={`top_country_pct_${n}`} type="number" step="0.01" max="100" />
          </div>
        </div>
      ))}

      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide pt-2">Age Distribution (%)</p>
      <div className="grid grid-cols-4 gap-2">
        {(['13_17', '18_24', '25_34', '35_44', '45_54', '55_64', '65_plus'] as const).map(range => (
          <div key={range} className="space-y-1">
            <Label className="text-xs">{range.replace('_', '-').replace('plus', '+')}</Label>
            <Input name={`age_${range}`} type="number" step="0.01" max="100" />
          </div>
        ))}
      </div>

      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide pt-2">Gender (%)</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="gender_male" className="text-xs">Male %</Label>
          <Input id="gender_male" name="gender_male" type="number" step="0.01" max="100" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="gender_female" className="text-xs">Female %</Label>
          <Input id="gender_female" name="gender_female" type="number" step="0.01" max="100" />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Snapshot'}</Button>
    </form>
  )
}
