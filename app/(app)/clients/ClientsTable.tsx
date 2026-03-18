'use client'
import { useState } from 'react'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { MessageButton } from '@/components/shared/MessageButton'
import { formatCurrency } from '@/lib/utils/format'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Channel } from '@/lib/utils/communication'

interface Client {
  id: string
  name: string
  contact_name: string | null
  email: string | null
  phone: string | null
  company: string | null
  communication_channel: string
  communication_handle: string | null
  notes: string | null
  status: string
  total_spent: number | null
  created_at: string | null
  updated_at: string | null
}

export function ClientsTable({ clients }: { clients: Client[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = clients.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.company ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || c.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
        {['all', 'active', 'paused', 'churned'].map(s => (
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
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(client => (
              <TableRow key={client.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell>
                  <Link href={`/clients/${client.id}`} className="font-medium hover:underline">
                    {client.name}
                  </Link>
                </TableCell>
                <TableCell className="text-gray-500">{client.company ?? '—'}</TableCell>
                <TableCell><StatusBadge status={client.status} /></TableCell>
                <TableCell>{formatCurrency(client.total_spent)}</TableCell>
                <TableCell className="text-sm text-gray-500">
                  {client.communication_handle ?? '—'}
                </TableCell>
                <TableCell>
                  {client.communication_handle && (
                    <MessageButton
                      channel={client.communication_channel as Channel}
                      handle={client.communication_handle}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                  No clients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
