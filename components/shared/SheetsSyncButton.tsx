'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet as SheetIcon } from 'lucide-react'

export function SheetsSyncButton({ campaignId }: { campaignId: string }) {
  const [open, setOpen] = useState(false)
  const [spreadsheetId, setSpreadsheetId] = useState('')
  const [sheetName, setSheetName] = useState('Campaign Results')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)

  async function handleSync() {
    if (!spreadsheetId.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/sheets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: campaignId,
          spreadsheet_id: spreadsheetId.trim(),
          sheet_name: sheetName.trim() || 'Campaign Results',
        }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ error: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <SheetIcon className="h-3.5 w-3.5 mr-1.5" />
        Sync to Sheets
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sync to Google Sheets</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Exports campaign name, status, dates, and reach/impressions/clicks. No costs, margins, or page names.
            </p>
            <div className="space-y-2">
              <Label htmlFor="spreadsheet_id">Spreadsheet ID</Label>
              <Input
                id="spreadsheet_id"
                value={spreadsheetId}
                onChange={e => setSpreadsheetId(e.target.value)}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
              />
              <p className="text-xs text-gray-400">Found in the Google Sheets URL: /spreadsheets/d/[ID]/edit</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sheet_name">Sheet Tab Name</Label>
              <Input
                id="sheet_name"
                value={sheetName}
                onChange={e => setSheetName(e.target.value)}
                placeholder="Campaign Results"
              />
            </div>
            {result?.success && (
              <p className="text-sm text-green-600 font-medium">✓ Synced successfully!</p>
            )}
            {result?.error && (
              <p className="text-sm text-red-600">{result.error}</p>
            )}
            <Button onClick={handleSync} disabled={loading || !spreadsheetId.trim()} className="w-full">
              {loading ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
