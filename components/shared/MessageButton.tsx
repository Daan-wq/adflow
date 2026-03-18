import { getMessageLink, type Channel } from '@/lib/utils/communication'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

interface MessageButtonProps {
  channel: Channel
  handle: string
  prefill?: string
  size?: 'sm' | 'default'
}

const channelColors: Record<Channel, string> = {
  whatsapp: 'text-green-600 hover:text-green-700',
  telegram: 'text-blue-500 hover:text-blue-600',
  instagram: 'text-pink-500 hover:text-pink-600',
  email: 'text-gray-600 hover:text-gray-700',
  signal: 'text-blue-700 hover:text-blue-800',
  sms: 'text-gray-500 hover:text-gray-600',
  other: 'text-gray-400 hover:text-gray-500',
}

export function MessageButton({ channel, handle, prefill, size = 'sm' }: MessageButtonProps) {
  const href = getMessageLink(channel, handle, prefill)
  return (
    <Button
      variant="ghost"
      size={size}
      onClick={() => window.open(href, '_blank')}
    >
      <MessageCircle className={`h-4 w-4 ${channelColors[channel]}`} />
      <span className="sr-only">Message via {channel}</span>
    </Button>
  )
}
