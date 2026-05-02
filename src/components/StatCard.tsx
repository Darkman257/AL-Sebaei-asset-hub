import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon: LucideIcon
  trend?: 'up' | 'down'
}

export default function StatCard({ title, value, change, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="glass-card neon-glow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-xl bg-[#00d4ff]/10">
          <Icon size={20} className="text-[#00d4ff]" />
        </div>
        {change && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-white/40 mt-1">{title}</p>
    </div>
  )
}
