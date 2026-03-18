'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, MonitorSmartphone, Megaphone, Wallet, LogOut, Menu, X } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/pages', label: 'Pages', icon: MonitorSmartphone },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/finances', label: 'Finances', icon: Wallet },
]

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex-1 p-2 space-y-1">
      {nav.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onClick}
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
  )
}

function LogoutButton() {
  return (
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
  )
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 border-r bg-white flex-col h-screen sticky top-0 shrink-0">
        <div className="p-4 border-b font-bold text-lg tracking-tight">AdFlow</div>
        <NavLinks />
        <LogoutButton />
      </aside>

      {/* Mobile hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg">AdFlow</span>
        <button onClick={() => setMobileOpen(true)} className="p-1">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-white flex flex-col shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-bold text-lg">AdFlow</span>
              <button onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <NavLinks onClick={() => setMobileOpen(false)} />
            <LogoutButton />
          </aside>
        </>
      )}
    </>
  )
}
