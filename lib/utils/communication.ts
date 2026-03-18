export type Channel = 'whatsapp' | 'telegram' | 'instagram' | 'email' | 'signal' | 'sms' | 'other'

export function getMessageLink(channel: Channel, handle: string, prefill?: string): string {
  const encoded = encodeURIComponent(prefill ?? '')
  switch (channel) {
    case 'whatsapp':
      return `https://wa.me/${handle.replace(/[^0-9]/g, '')}${prefill ? `?text=${encoded}` : ''}`
    case 'telegram':
      return `https://t.me/${handle.replace('@', '')}`
    case 'instagram':
      return `https://ig.me/m/${handle.replace('@', '')}`
    case 'email':
      return `mailto:${handle}${prefill ? `?body=${encoded}` : ''}`
    case 'signal':
      return `https://signal.me/#p/${handle}`
    case 'sms':
      return `sms:${handle}${prefill ? `?body=${encoded}` : ''}`
    default:
      return '#'
  }
}
