export function formatCurrency(amount: number | string | null | undefined, currency = 'EUR'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0)
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency }).format(num)
}

export function formatNumber(n: number | null | undefined): string {
  return new Intl.NumberFormat('nl-NL').format(n ?? 0)
}

export function marginColor(marginPct: number): string {
  if (marginPct < 10) return 'text-red-600'
  if (marginPct < 30) return 'text-yellow-600'
  return 'text-green-600'
}

export function marginBgColor(marginPct: number): string {
  if (marginPct < 10) return 'bg-red-50 text-red-700'
  if (marginPct < 30) return 'bg-yellow-50 text-yellow-700'
  return 'bg-green-50 text-green-700'
}
