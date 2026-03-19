'use client'
import { useState, useMemo } from 'react'
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
  platform: string | null
  country: string | null
  page_link: string | null
  follower_count: number | null
  avg_engagement_rate: number | null
  avg_cpm: number | null
  reliability_score: number | null
  status: string
  communication_channel: string
  communication_handle: string | null
  latest_views: number | null
  latest_reach: number | null
  latest_engagement: number | null
}

type SortKey = 'handle' | 'follower_count' | 'avg_cpm' | 'reliability_score' | 'latest_views'
type SortDir = 'asc' | 'desc'

const PLATFORM_ICONS: Record<string, string> = {
  instagram: '📸',
  tiktok: '🎵',
  facebook: '📘',
  youtube: '▶️',
  twitter: '🐦',
  other: '🌐',
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-sm capitalize font-medium transition-colors ${
        active ? 'bg-gray-900 text-white' : 'bg-white border hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  )
}

export function PagesTable({ pages }: { pages: Page[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('all')
  const [nicheFilter, setNicheFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('handle')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const platforms = useMemo(
    () => ['all', ...Array.from(new Set(pages.map(p => p.platform).filter((x): x is string => !!x)))],
    [pages]
  )
  const countries = useMemo(
    () => ['all', ...Array.from(new Set(pages.map(p => p.country).filter((x): x is string => !!x))).sort()],
    [pages]
  )
  const niches = useMemo(
    () => ['all', ...Array.from(new Set(pages.map(p => p.niche).filter((x): x is string => !!x))).sort()],
    [pages]
  )

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="text-gray-300 ml-1">↕</span>
    return <span className="text-gray-700 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const filtered = useMemo(() => {
    return pages
      .filter(p => {
        const q = search.toLowerCase()
        const matchSearch =
          p.handle.toLowerCase().includes(q) ||
          (p.niche ?? '').toLowerCase().includes(q) ||
          (p.country ?? '').toLowerCase().includes(q)
        const matchStatus = statusFilter === 'all' || p.status === statusFilter
        const matchPlatform = platformFilter === 'all' || p.platform === platformFilter
        const matchCountry = countryFilter === 'all' || p.country === countryFilter
        const matchNiche = nicheFilter === 'all' || p.niche === nicheFilter
        return matchSearch && matchStatus && matchPlatform && matchCountry && matchNiche
      })
      .sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1
        if (sortKey === 'handle') return a.handle.localeCompare(b.handle) * dir
        const av = (a[sortKey] as number | null) ?? -Infinity
        const bv = (b[sortKey] as number | null) ?? -Infinity
        return (av > bv ? 1 : av < bv ? -1 : 0) * dir
      })
  }, [pages, search, statusFilter, platformFilter, countryFilter, nicheFilter, sortKey, sortDir])

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search pages..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="max-w-xs"
      />

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-400 font-medium">Status:</span>
        {['all', 'active', 'paused', 'blacklisted'].map(s => (
          <FilterButton key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
            {s}
          </FilterButton>
        ))}
      </div>

      {platforms.length > 1 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400 font-medium">Platform:</span>
          {platforms.map(p => (
            <FilterButton key={p} active={platformFilter === p} onClick={() => setPlatformFilter(p)}>
              {p !== 'all' ? `${PLATFORM_ICONS[p] ?? '🌐'} ${p}` : 'all'}
            </FilterButton>
          ))}
        </div>
      )}

      {countries.length > 1 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400 font-medium">Country:</span>
          {countries.map(c => (
            <FilterButton key={c} active={countryFilter === c} onClick={() => setCountryFilter(c)}>
              {c}
            </FilterButton>
          ))}
        </div>
      )}

      {niches.length > 1 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400 font-medium">Niche:</span>
          {niches.map(n => (
            <FilterButton key={n} active={nicheFilter === n} onClick={() => setNicheFilter(n)}>
              {n}
            </FilterButton>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-400">{filtered.length} pages</div>

      <div className="rounded-md border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button onClick={() => toggleSort('handle')} className="flex items-center hover:text-gray-900">
                  Handle
                  <SortIcon col="handle" />
                </button>
              </TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Niche</TableHead>
              <TableHead>
                <button onClick={() => toggleSort('follower_count')} className="flex items-center hover:text-gray-900">
                  Followers
                  <SortIcon col="follower_count" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => toggleSort('latest_views')} className="flex items-center hover:text-gray-900">
                  Views/mo
                  <SortIcon col="latest_views" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => toggleSort('avg_cpm')} className="flex items-center hover:text-gray-900">
                  CPM
                  <SortIcon col="avg_cpm" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => toggleSort('reliability_score')}
                  className="flex items-center hover:text-gray-900"
                >
                  Reliability
                  <SortIcon col="reliability_score" />
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(page => (
              <TableRow key={page.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Link href={`/pages/${page.id}`} className="font-medium hover:underline">
                      {page.handle}
                    </Link>
                    {page.page_link && (
                      <a
                        href={page.page_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-600 text-xs"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {page.platform ? `${PLATFORM_ICONS[page.platform] ?? '🌐'} ${page.platform}` : '—'}
                </TableCell>
                <TableCell className="text-sm text-gray-500">{page.country ?? '—'}</TableCell>
                <TableCell className="text-sm text-gray-500">{page.niche ?? '—'}</TableCell>
                <TableCell className="text-sm">
                  {page.follower_count ? formatNumber(page.follower_count) : '—'}
                </TableCell>
                <TableCell className="text-sm">
                  {page.latest_views ? formatNumber(page.latest_views) : '—'}
                </TableCell>
                <TableCell className="text-sm">{page.avg_cpm ? formatCurrency(page.avg_cpm) : '—'}</TableCell>
                <TableCell className="text-sm">
                  {page.reliability_score ? `${page.reliability_score}/10` : '—'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={page.status} />
                </TableCell>
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
                <TableCell colSpan={10} className="text-center text-gray-400 py-8">
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
