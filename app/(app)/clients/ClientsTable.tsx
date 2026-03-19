'use client'
import { useState, useMemo } from 'react'
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
  country: string | null
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
  const [countryFilter, setCountryFilter] = useState('all')
  const [sortKey, setSortKey] = useState<'name' | 'total_spent'>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const countries = useMemo(
    () => ['all', ...Array.from(new Set(clients.map(c => c.country).filter((x): x is string => !!x))).sort()],
    [clients]
  )

  const filtered = useMemo(() => {
    return clients
      .filter(c => {
        const q = search.toLowerCase()
        const matchSearch =
          c.name.toLowerCase().includes(q) ||
          (c.company ?? '').toLowerCase().includes(q)
        const matchStatus = filter === 'all' || c.status === filter
        const matchCountry = countryFilter === 'all' || c.country === countryFilter
        return matchSearch && matchStatus && matchCountry
      })
      .sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1
        if (sortKey === 'name') return a.name.localeCompare(b.name) * dir
        const av = a.total_spent ?? 0
        const bv = b.total_spent ?? 0
        return (av - bv) * dir
      })
  }, [clients, search, filter, countryFilter, sortKey, sortDir])

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
      {countries.length > 1 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400 font-medium">Country:</span>
          {countries.map(c => (
            <button
              key={c}
              onClick={() => setCountryFilter(c)}
              className={`px-3 py-1.5 rounded text-sm capitalize font-medium transition-colors ${
                countryFilter === c ? 'bg-gray-900 text-white' : 'bg-white border hover:bg-gray-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <button
                  onClick={() => {
                    if (sortKey === 'total_spent') {
                      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
                    } else {
                      setSortKey('total_spent')
                      setSortDir('desc')
                    }
                  }}
                  className="flex items-center hover:text-gray-900"
                >
                  Total Spent{' '}
                  {sortKey === 'total_spent' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </button>
              </TableHead>
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
                <TableCell className="text-sm text-gray-500">{client.country ?? '—'}</TableCell>
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
                <TableCell colSpan={7} className="text-center text-gray-400 py-8">
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
