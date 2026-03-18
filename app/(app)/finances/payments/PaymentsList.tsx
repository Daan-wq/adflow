'use client'
import { useState } from 'react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency } from '@/lib/utils/format'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { updatePaymentStatusAction } from '@/app/actions/finances'

interface Payment {
  id: string
  direction: string
  amount: number
  currency: string
  payment_method: string | null
  payment_reference: string | null
  status: string
  due_date: string | null
  paid_at: string | null
  created_at: string | null
  clients?: { name: string } | null
  pages?: { handle: string } | null
  campaigns?: { name: string } | null
}

export function PaymentsList({ payments }: { payments: Payment[] }) {
  const [dirFilter, setDirFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = payments.filter(p =>
    (dirFilter === 'all' || p.direction === dirFilter) &&
    (statusFilter === 'all' || p.status === statusFilter)
  )

  async function handleStatusChange(id: string, status: string) {
    await updatePaymentStatusAction(id, status)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['all', 'incoming', 'outgoing'].map(d => (
          <button key={d} onClick={() => setDirFilter(d)}
            className={`px-3 py-1.5 rounded text-sm capitalize font-medium ${dirFilter === d ? 'bg-gray-900 text-white' : 'bg-white border'}`}>
            {d}
          </button>
        ))}
        <span className="border-l mx-1" />
        {['all', 'pending', 'completed', 'failed'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded text-sm capitalize font-medium ${statusFilter === s ? 'bg-gray-900 text-white' : 'bg-white border'}`}>
            {s}
          </button>
        ))}
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Direction</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell>
                  <span className={p.direction === 'incoming' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {p.direction === 'incoming' ? '↓ In' : '↑ Out'}
                  </span>
                </TableCell>
                <TableCell className="text-sm">
                  {p.direction === 'incoming' ? (p.clients?.name ?? '—') : (p.pages?.handle ?? '—')}
                </TableCell>
                <TableCell className="text-sm text-gray-500">{p.campaigns?.name ?? '—'}</TableCell>
                <TableCell className="text-sm text-gray-500">{p.payment_method ?? '—'}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(Number(p.amount), p.currency)}</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
                <TableCell className="text-sm text-gray-400">
                  {p.due_date ? new Date(p.due_date).toLocaleDateString('nl-NL') : '—'}
                </TableCell>
                <TableCell>
                  {p.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(p.id, 'completed')}
                      className="text-xs text-green-600 hover:underline font-medium"
                    >
                      Mark paid
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-400 py-8">No payments found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
