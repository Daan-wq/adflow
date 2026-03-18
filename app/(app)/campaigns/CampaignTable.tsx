'use client'
import { useState } from 'react'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency } from '@/lib/utils/format'
import { cn } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'

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

type SortKey = 'name' | 'client' | 'status' | 'client_pays' | 'your_margin' | 'created_at'

function marginPct(campaign: Campaign): number {
  if (!campaign.client_pays || campaign.client_pays === 0) return 0
  return (campaign.your_margin / campaign.client_pays) * 100
}

export function CampaignTable({ campaigns }: { campaigns: Campaign[] }) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [statusFilter, setStatusFilter] = useState('all')

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const filtered = campaigns
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.clients?.name ?? '').toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      let av: string | number = '', bv: string | number = ''
      if (sortKey === 'client') { av = a.clients?.name ?? ''; bv = b.clients?.name ?? '' }
      else if (sortKey === 'client_pays') { av = a.client_pays; bv = b.client_pays }
      else if (sortKey === 'your_margin') { av = a.your_margin; bv = b.your_margin }
      else if (sortKey === 'created_at') { av = a.created_at ?? ''; bv = b.created_at ?? '' }
      else if (sortKey === 'status') { av = a.status; bv = b.status }
      else { av = a.name; bv = b.name }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const statuses = ['all', 'draft', 'confirmed', 'scheduled', 'live', 'completed', 'cancelled']

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Input placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
        {statuses.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-2.5 py-1 rounded text-xs capitalize font-medium ${statusFilter === s ? 'bg-gray-900 text-white' : 'bg-white border'}`}>
            {s}
          </button>
        ))}
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>Name {sortKey === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('client')}>Client {sortKey === 'client' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>Status</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('client_pays')}>Revenue {sortKey === 'client_pays' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('your_margin')}>Margin {sortKey === 'your_margin' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</TableHead>
              <TableHead>Margin %</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(c => {
              const pct = marginPct(c)
              return (
                <TableRow key={c.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>
                    <Link href={`/campaigns/${c.id}`} className="font-medium hover:underline">{c.name}</Link>
                  </TableCell>
                  <TableCell className="text-gray-500">{c.clients?.name ?? '—'}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                  <TableCell>{formatCurrency(c.client_pays)}</TableCell>
                  <TableCell>{formatCurrency(c.your_margin)}</TableCell>
                  <TableCell>
                    <span className={cn('text-sm font-semibold', pct < 10 ? 'text-red-600' : pct < 30 ? 'text-yellow-600' : 'text-green-600')}>
                      {pct.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString('nl-NL') : '—'}
                  </TableCell>
                </TableRow>
              )
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-400 py-8">No campaigns found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
