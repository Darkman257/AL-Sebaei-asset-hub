import { Building2, Users, TrendingUp, Receipt, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import PageHeader from '../components/PageHeader'
import { SkeletonCard, SkeletonTable } from '../components/Skeleton'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({ properties: 0, tenants: 0, revenue: 0, pendingExpenses: 0 })
  const [maintenance, setMaintenance] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [propRes, tenantRes, revRes, expRes, maintRes] = await Promise.all([
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('tenants').select('id', { count: 'exact', head: true }).eq('status', 'Active'),
        supabase.from('revenue').select('amount').eq('status', 'Received'),
        supabase.from('expenses').select('amount').eq('status', 'Pending'),
        supabase.from('maintenance_requests').select('id, issue, priority, status').limit(4),
      ])
      const totalRev = revRes.data?.reduce((sum, r) => sum + Number(r.amount), 0) || 0
      const totalExp = expRes.data?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
      setStats({ properties: propRes.count || 0, tenants: tenantRes.count || 0, revenue: totalRev, pendingExpenses: totalExp })
      setMaintenance(maintRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your asset portfolio" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <SkeletonTable />
    </div>
  )

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your asset portfolio" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Building2} title="Total Properties" value={stats.properties} change="+2 this year" trend="up" delay={0} />
        <StatCard icon={Users} title="Active Tenants" value={stats.tenants} change="+12%" trend="up" delay={1} />
        <StatCard icon={TrendingUp} title="Monthly Revenue" value={`SAR ${(stats.revenue/1000000).toFixed(2)}M`} change="+8.5%" trend="up" delay={2} />
        <StatCard icon={Receipt} title="Pending Expenses" value={`SAR ${(stats.pendingExpenses/1000).toFixed(0)}K`} change="-15%" trend="down" delay={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 glass-card neon-glow p-6 card-enter stagger-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Revenue Trend</h3>
            <span className="flex items-center gap-1 text-xs text-green-400"><ArrowUpRight size={12} /> +8.5% vs last period</span>
          </div>
          <div className="flex items-end gap-3 h-48">
            {[65, 70, 72, 75, 78, 82].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full rounded-t-lg bg-gradient-to-t from-[#00d4ff]/20 to-[#00d4ff]/60 group-hover:from-[#00d4ff]/30 group-hover:to-[#00d4ff]/80 transition-all duration-300 relative" style={{ height: `${h}%` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white/0 group-hover:text-white/60 transition-all">
                    {(1.1 + i * 0.04).toFixed(2)}M
                  </div>
                </div>
                <span className="text-xs text-white/40">{['Jun','Jul','Aug','Sep','Oct','Nov'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card neon-glow p-6 card-enter stagger-3">
          <h3 className="text-lg font-semibold text-white mb-6">Occupancy Rate</h3>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90">
                <circle cx="72" cy="72" r="60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
                <circle cx="72" cy="72" r="60" fill="none" stroke="url(#gradient)" strokeWidth="10"
                  strokeDasharray={`${88 * 3.77} ${100 * 3.77}`} strokeLinecap="round"
                  className="drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white animate-number">88%</span>
                <span className="text-[10px] text-white/30 mt-1">occupied</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-enter stagger-3">
          <DataTable
            title="Recent Maintenance"
            columns={[
              { key: 'issue', label: 'Issue' },
              { key: 'priority', label: 'Priority' },
              { key: 'status', label: 'Status' },
            ]}
            data={maintenance}
          />
        </div>
        
        <div className="glass-card neon-glow p-6 card-enter stagger-4">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Alerts</h3>
          <div className="space-y-3">
            {[
              { text: '3 leases expiring within 30 days', level: 'warning' },
              { text: '2 critical maintenance requests open', level: 'error' },
              { text: 'Insurance renewal due Dec 15', level: 'info' },
              { text: 'Q4 tax filing deadline approaching', level: 'warning' },
            ].map((alert, i) => (
              <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 hover:scale-[1.01] cursor-default ${
                alert.level === 'error' ? 'bg-red-500/5 border-red-500/10' :
                alert.level === 'warning' ? 'bg-yellow-500/5 border-yellow-500/10' : 'bg-[#00d4ff]/5 border-[#00d4ff]/10'
              }`}>
                <AlertTriangle size={14} className={
                  alert.level === 'error' ? 'text-red-400' : alert.level === 'warning' ? 'text-yellow-400' : 'text-[#00d4ff]'
                } />
                <span className="text-sm text-white/60">{alert.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
