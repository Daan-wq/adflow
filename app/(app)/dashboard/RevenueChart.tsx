'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DataPoint {
  month: string
  revenue: number
  margin: number
}

export function RevenueChart({ data }: { data: DataPoint[] }) {
  if (data.every(d => d.revenue === 0 && d.margin === 0)) {
    return <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `€${v}`} />
        <Tooltip formatter={(value: any) => `€${(value ?? 0).toFixed(2)}`} />
        <Legend />
        <Bar dataKey="revenue" name="Revenue" fill="#94a3b8" radius={[2, 2, 0, 0]} />
        <Bar dataKey="margin" name="Margin" fill="#22c55e" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
