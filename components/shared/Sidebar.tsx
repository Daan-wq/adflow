'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, MonitorSmartphone, Megaphone, Wallet, LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/pages', label: 'Pages', icon: MonitorSmartphone },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/finances', label: 'Finances', icon: Wallet },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-56 border-r bg-white flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-4 border-b font-bold text-lg tracking-tight">AdFlow</div>
      <nav className="flex-1 p-2 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-2 border-t">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 w-full text-left"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
