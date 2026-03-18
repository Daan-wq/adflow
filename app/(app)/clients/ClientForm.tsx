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

interface ClientFormProps {
  client?: Client
  action: (fd: FormData) => Promise<void>
}

export function ClientForm({ client, action }: ClientFormProps) {
  return (
    <form action={action} className="space-y-4 max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" defaultValue={client?.name ?? ''} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" defaultValue={client?.company ?? ''} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact_name">Contact Name</Label>
          <Input id="contact_name" name="contact_name" defaultValue={client?.contact_name ?? ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={client?.email ?? ''} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="communication_channel">Channel *</Label>
          <select
            name="communication_channel"
            defaultValue={client?.communication_channel ?? 'whatsapp'}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white"
          >
            {['whatsapp', 'telegram', 'instagram', 'email', 'signal', 'sms', 'other'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="communication_handle">Handle / Phone</Label>
          <Input
            id="communication_handle"
            name="communication_handle"
            defaultValue={client?.communication_handle ?? ''}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={client?.phone ?? ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            name="status"
            defaultValue={client?.status ?? 'active'}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white"
          >
            {['active', 'paused', 'churned'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" defaultValue={client?.notes ?? ''} rows={3} />
      </div>
      <SubmitButton label={client ? 'Save Changes' : 'Create Client'} />
    </form>
  )
}
