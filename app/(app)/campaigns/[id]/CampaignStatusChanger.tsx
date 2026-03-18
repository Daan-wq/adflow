'use client'
import { useState } from 'react'
import { updateCampaignStatusAction } from '@/app/actions/campaigns'
import { Button } from '@/components/ui/button'

const STATUSES = ['draft', 'confirmed', 'scheduled', 'live', 'completed', 'cancelled']

export function CampaignStatusChanger({ campaignId, currentStatus }: { campaignId: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true)
    await updateCampaignStatusAction(campaignId, e.target.value)
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={currentStatus}
        onChange={handleChange}
        disabled={loading}
        className="border rounded-md px-3 py-1.5 text-sm bg-white"
      >
        {STATUSES.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  )
}
