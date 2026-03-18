'use client'
import { useState } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { CampaignKanban } from './CampaignKanban'
import { CampaignTable } from './CampaignTable'

interface Campaign {
  id: string
  name: string
  client_id: string | null
  status: string
  client_pays: number
  total_page_cost: number
  your_margin: number
  start_date: string | null
  end_date: string | null
  created_at: string | null
  clients?: { name: string } | null
}

export function CampaignsView({ campaigns }: { campaigns: Campaign[] }) {
  const [view, setView] = useState<'kanban' | 'table'>('kanban')

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView('kanban')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium ${view === 'kanban' ? 'bg-gray-900 text-white' : 'bg-white border'}`}
        >
          <LayoutGrid className="h-3.5 w-3.5" /> Kanban
        </button>
        <button
          onClick={() => setView('table')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium ${view === 'table' ? 'bg-gray-900 text-white' : 'bg-white border'}`}
        >
          <List className="h-3.5 w-3.5" /> Table
        </button>
      </div>
      {view === 'kanban' ? (
        <CampaignKanban campaigns={campaigns} />
      ) : (
        <CampaignTable campaigns={campaigns} />
      )}
    </div>
  )
}
