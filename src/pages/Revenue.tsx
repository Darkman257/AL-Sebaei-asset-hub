import { TrendingUp } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { revenueData } from '../lib/data'

export default function Revenue() {
  const maxRevenue = Math.max(...revenueData.map(d => d.rental + d.services + d.other))
  
  return (
    <div>
      <PageHeader title="Revenue" description="Income streams and financial performance" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={TrendingUp} title="Total Revenue (Month)" value="SAR 1.32M" trend="up" change="+8.5%" />
        <StatCard icon={TrendingUp} title="Rental Income" value="SAR 1.25M" />
        <StatCard icon={TrendingUp} title="Service Charges" value="SAR 58K" />
        <StatCard icon={TrendingUp} title="Collection Rate" value="96.5%" trend="up" change="+2%" />
      </div>

      <div className="glass-card neon-glow p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-6">Revenue Breakdown (6 Months)</h3>
        <div className="flex items-end gap-4 h-64">
          {revenueData.map((d, i) => {
            const total = d.rental + d.services + d.other
            const h = (total / maxRevenue) * 100
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col rounded-t-lg overflow-hidden" style={{ height: `${h}%` }}>
                  <div className="flex-[12] bg-[#00d4ff]/20" />
                  <div className="flex-[48] bg-[#00d4ff]/40" />
                  <div className="flex-[1250] bg-gradient-to-t from-[#00d4ff]/60 to-[#00d4ff]/80" />
                </div>
                <span className="text-xs text-white/40">{d.month}</span>
              </div>
            )
          })}
        </div>
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#00d4ff]/80" /><span className="text-xs text-white/40">Rental</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#00d4ff]/40" /><span className="text-xs text-white/40">Services</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#00d4ff]/20" /><span className="text-xs text-white/40">Other</span></div>
        </div>
      </div>
    </div>
  )
}
