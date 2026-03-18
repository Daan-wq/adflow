'use client'
import { useState } from 'react'
import { createCampaignAction } from '@/app/actions/campaigns'
import { formatCurrency } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Client {
  id: string
  name: string
}

interface Page {
  id: string
  handle: string
  niche: string | null
  follower_count: number | null
  avg_cpm: number | null
  reliability_score: number | null
  avg_engagement_rate: number | null
}

interface SelectedPage {
  page_id: string
  handle: string
  cost: number
  scheduled_date: string
}

type Step = 'client' | 'budget' | 'pages' | 'costs' | 'content' | 'review'
const STEPS: Step[] = ['client', 'budget', 'pages', 'costs', 'content', 'review']
const STEP_LABELS = ['Client', 'Budget', 'Pages', 'Costs', 'Content', 'Review']

interface WizardState {
  name: string
  client_id: string
  client_name: string
  client_pays: number
  selected_pages: SelectedPage[]
  ad_content_url: string
  ad_caption: string
  ad_link: string
  start_date: string
  end_date: string
}

export function CampaignWizard({ clients, pages }: { clients: Client[]; pages: Page[] }) {
  const [step, setStep] = useState<Step>('client')
  const [state, setState] = useState<WizardState>({
    name: '',
    client_id: '',
    client_name: '',
    client_pays: 0,
    selected_pages: [],
    ad_content_url: '',
    ad_caption: '',
    ad_link: '',
    start_date: '',
    end_date: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const stepIndex = STEPS.indexOf(step)
  const totalCost = state.selected_pages.reduce((sum, p) => sum + p.cost, 0)
  const margin = state.client_pays - totalCost
  const marginPct = state.client_pays > 0 ? (margin / state.client_pays) * 100 : 0

  function next() { setStep(STEPS[stepIndex + 1]) }
  function back() { setStep(STEPS[stepIndex - 1]) }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    const result = await createCampaignAction({
      name: state.name,
      client_id: state.client_id,
      client_pays: state.client_pays,
      pages: state.selected_pages.map(p => ({
        page_id: p.page_id,
        cost: p.cost,
        scheduled_date: p.scheduled_date || undefined,
      })),
      ad_content_url: state.ad_content_url || undefined,
      ad_caption: state.ad_caption || undefined,
      ad_link: state.ad_link || undefined,
      start_date: state.start_date || undefined,
      end_date: state.end_date || undefined,
    })
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-1 mb-6 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 shrink-0">
            <div className={cn(
              'w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium',
              i < stepIndex ? 'bg-green-500 text-white' :
              i === stepIndex ? 'bg-gray-900 text-white' :
              'bg-gray-200 text-gray-500'
            )}>
              {i + 1}
            </div>
            <span className={cn('text-xs', i === stepIndex ? 'font-medium' : 'text-gray-400')}>
              {STEP_LABELS[i]}
            </span>
            {i < STEPS.length - 1 && <div className="w-4 h-px bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          {step === 'client' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  value={state.name}
                  onChange={e => setState(s => ({ ...s, name: e.target.value }))}
                  placeholder="e.g. Nike Summer Campaign"
                />
              </div>
              <div className="space-y-2">
                <Label>Client *</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {clients.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setState(s => ({ ...s, client_id: c.id, client_name: c.name }))}
                      className={cn(
                        'text-left p-3 rounded-lg border text-sm font-medium transition-colors',
                        state.client_id === c.id ? 'bg-gray-900 text-white border-gray-900' : 'bg-white hover:bg-gray-50'
                      )}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={next} disabled={!state.name || !state.client_id} className="w-full">
                Next: Set Budget
              </Button>
            </div>
          )}

          {step === 'budget' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client_pays">Client Budget (EUR) *</Label>
                <Input
                  id="client_pays"
                  type="number"
                  min="0"
                  step="0.01"
                  value={state.client_pays || ''}
                  onChange={e => setState(s => ({ ...s, client_pays: parseFloat(e.target.value) || 0 }))}
                  placeholder="500.00"
                />
                <p className="text-xs text-gray-400">What {state.client_name} pays you for this campaign</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={back}>Back</Button>
                <Button onClick={next} disabled={state.client_pays <= 0} className="flex-1">
                  Next: Select Pages
                </Button>
              </div>
            </div>
          )}

          {step === 'pages' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Select pages to run this campaign. Suggested pages are ranked by reliability and budget fit.</p>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {pages
                  .sort((a, b) => (b.reliability_score ?? 5) - (a.reliability_score ?? 5))
                  .map(page => {
                    const selected = state.selected_pages.some(p => p.page_id === page.id)
                    return (
                      <button
                        key={page.id}
                        onClick={() => {
                          if (selected) {
                            setState(s => ({ ...s, selected_pages: s.selected_pages.filter(p => p.page_id !== page.id) }))
                          } else {
                            setState(s => ({
                              ...s,
                              selected_pages: [...s.selected_pages, {
                                page_id: page.id,
                                handle: page.handle,
                                cost: page.avg_cpm ? Math.round(page.avg_cpm * 10) : 0,
                                scheduled_date: '',
                              }]
                            }))
                          }
                        }}
                        className={cn(
                          'w-full text-left p-3 rounded-lg border text-sm transition-colors',
                          selected ? 'bg-gray-900 text-white border-gray-900' : 'bg-white hover:bg-gray-50'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{page.handle}</span>
                          <span className={cn('text-xs', selected ? 'text-gray-300' : 'text-gray-400')}>
                            {page.reliability_score ?? 5}/10 reliability
                          </span>
                        </div>
                        <div className={cn('text-xs mt-0.5', selected ? 'text-gray-300' : 'text-gray-400')}>
                          {page.niche ?? 'No niche'} · {page.follower_count ? `${(page.follower_count / 1000).toFixed(0)}k followers` : '?'} · Est. avg CPM {page.avg_cpm ? formatCurrency(page.avg_cpm) : '?'}
                        </div>
                      </button>
                    )
                  })}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={back}>Back</Button>
                <Button onClick={next} disabled={state.selected_pages.length === 0} className="flex-1">
                  Next: Set Costs ({state.selected_pages.length} selected)
                </Button>
              </div>
            </div>
          )}

          {step === 'costs' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Set what you pay each page. Total must leave a good margin.</p>
              <div className="space-y-3">
                {state.selected_pages.map((sp, i) => (
                  <div key={sp.page_id} className="p-3 border rounded-lg space-y-2">
                    <p className="font-medium text-sm">{sp.handle}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Cost (EUR)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={sp.cost || ''}
                          onChange={e => setState(s => ({
                            ...s,
                            selected_pages: s.selected_pages.map((p, idx) =>
                              idx === i ? { ...p, cost: parseFloat(e.target.value) || 0 } : p
                            )
                          }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Scheduled Date</Label>
                        <Input
                          type="date"
                          value={sp.scheduled_date}
                          onChange={e => setState(s => ({
                            ...s,
                            selected_pages: s.selected_pages.map((p, idx) =>
                              idx === i ? { ...p, scheduled_date: e.target.value } : p
                            )
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={cn(
                'p-3 rounded-lg text-sm font-medium',
                marginPct < 10 ? 'bg-red-50 text-red-700' : marginPct < 30 ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
              )}>
                Running total: {formatCurrency(totalCost)} cost → {formatCurrency(margin)} margin ({marginPct.toFixed(1)}%)
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={back}>Back</Button>
                <Button onClick={next} className="flex-1">Next: Add Content</Button>
              </div>
            </div>
          )}

          {step === 'content' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ad_content_url">Ad Content URL</Label>
                <Input id="ad_content_url" value={state.ad_content_url} onChange={e => setState(s => ({ ...s, ad_content_url: e.target.value }))} placeholder="https://drive.google.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad_caption">Caption</Label>
                <Textarea id="ad_caption" value={state.ad_caption} onChange={e => setState(s => ({ ...s, ad_caption: e.target.value }))} rows={3} placeholder="Ad caption text..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad_link">CTA Link</Label>
                <Input id="ad_link" value={state.ad_link} onChange={e => setState(s => ({ ...s, ad_link: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input id="start_date" type="date" value={state.start_date} onChange={e => setState(s => ({ ...s, start_date: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input id="end_date" type="date" value={state.end_date} onChange={e => setState(s => ({ ...s, end_date: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={back}>Back</Button>
                <Button onClick={next} className="flex-1">Review Campaign</Button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Campaign</span><span className="font-medium">{state.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Client</span><span className="font-medium">{state.client_name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Revenue</span><span className="font-medium">{formatCurrency(state.client_pays)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Total Page Cost</span><span className="font-medium">{formatCurrency(totalCost)}</span></div>
                <div className={cn('flex justify-between font-semibold p-2 rounded', marginPct < 10 ? 'bg-red-50 text-red-700' : marginPct < 30 ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700')}>
                  <span>Your Margin</span><span>{formatCurrency(margin)} ({marginPct.toFixed(1)}%)</span>
                </div>
                <div className="border-t pt-3">
                  <p className="text-gray-500 mb-2">Pages ({state.selected_pages.length})</p>
                  {state.selected_pages.map(p => (
                    <div key={p.page_id} className="flex justify-between text-xs">
                      <span>{p.handle}</span>
                      <span>{formatCurrency(p.cost)}</span>
                    </div>
                  ))}
                </div>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-2">
                <Button variant="outline" onClick={back}>Back</Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Creating...' : 'Confirm Campaign'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
