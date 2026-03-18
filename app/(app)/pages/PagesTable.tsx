'use client'
import { useState } from 'react'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { MessageButton } from '@/components/shared/MessageButton'
import { formatCurrency, formatNumber } from '@/lib/utils/format'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Channel } from '@/lib/utils/communication'

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

export function PagesTable({ pages }: { pages: Page[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = pages.filter(p => {
    const matchesSearch =
      p.handle.toLowerCase().includes(search.toLowerCase()) ||
      (p.niche ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || p.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Input
          placeholder="Search pages..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
        {['all', 'active', 'paused', 'blacklisted'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded text-sm capitalize font-medium transition-colors ${
              filter === s ? 'bg-gray-900 text-white' : 'bg-white border hover:bg-gray-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="rounded-md border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Handle</TableHead>
              <TableHead>Niche</TableHead>
              <TableHead>Followers</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Avg CPM</TableHead>
              <TableHead>Reliability</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(page => (
              <TableRow key={page.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell>
                  <Link href={`/pages/${page.id}`} className="font-medium hover:underline">
                    {page.handle}
                  </Link>
                </TableCell>
                <TableCell className="text-gray-500">{page.niche ?? '—'}</TableCell>
                <TableCell className="text-sm">
                  {page.follower_count ? formatNumber(page.follower_count) : '—'}
                </TableCell>
                <TableCell className="text-sm">
                  {page.avg_engagement_rate ? `${page.avg_engagement_rate.toFixed(2)}%` : '—'}
                </TableCell>
                <TableCell className="text-sm">
                  {page.avg_cpm ? formatCurrency(page.avg_cpm) : '—'}
                </TableCell>
                <TableCell className="text-sm">
                  {page.reliability_score ? `${page.reliability_score}/10` : '—'}
                </TableCell>
                <TableCell><StatusBadge status={page.status} /></TableCell>
                <TableCell>
                  {page.communication_handle && (
                    <MessageButton
                      channel={page.communication_channel as Channel}
                      handle={page.communication_handle}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                  No pages found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
