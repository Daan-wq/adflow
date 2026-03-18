'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS: Record<string, string> = {
  draft: '#e2e8f0',
  confirmed: '#93c5fd',
  scheduled: '#c4b5fd',
  live: '#86efac',
  completed: '#94a3b8',
  cancelled: '#fca5a5',
}

interface DataPoint {
  name: string
  value: number
}

export function CampaignStatusDonut({ data }: { data: DataPoint[] }) {
  if (data.length === 0 || data.every(d => d.value === 0)) {
    return <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No campaigns yet</div>
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map(entry => (
            <Cell key={entry.name} fill={COLORS[entry.name] ?? '#94a3b8'} />
          ))}
        </Pie>
        <Tooltip />
        <Legend formatter={(value) => <span className="text-xs capitalize">{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  )
}
