import { Building2, Users, TrendingUp, Receipt, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import PageHeader from '../components/PageHeader'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({ properties: 0, tenants: 0, revenue: 0, pendingExpenses: 0 })
  const [maintenance, setMaintenance] = useState<any[]>([])

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
      setStats({
        properties: propRes.count || 0,
        tenants: tenantRes.count || 0,
        revenue: totalRev,
        pendingExpenses: totalExp,
      })
      setMaintenance(maintRes.data || [])
    }
    load()
  }, [])

  const formatSAR = (n: number) => `SAR ${(n / 1000000).toFixed(2)}M`

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your asset portfolio" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Building2} title="Total Properties" value={stats.properties} change="+2 this year" trend="up" />
        <StatCard icon={Users} title="Active Tenants" value={stats.tenants} change="+12%" trend="up" />
        <StatCard icon={TrendingUp} title="Monthly Revenue" value={formatSAR(stats.revenue)} change="+8.5%" trend="up" />
        <StatCard icon={Receipt} title="Pending Expenses" value={`SAR ${(stats.pendingExpenses/1000).toFixed(0)}K`} change="-15%" trend="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 glass-card neon-glow p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend (6 Months)</h3>
          <div className="flex items-end gap-3 h-48">
            {[65, 70, 72, 75, 78, 82].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-gradient-to-t from-[#00d4ff]/20 to-[#00d4ff]/60 transition-all" style={{ height: `${h}%` }} />
                <span className="text-xs text-white/40">{['Jun','Jul','Aug','Sep','Oct','Nov'][i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card neon-glow p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Occupancy Rate</h3>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                <circle cx="64" cy="64" r="56" fill="none" stroke="#00d4ff" strokeWidth="12" strokeDasharray={`${88 * 3.52} ${100 * 3.52}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">88%</span>
              </div>
            </div>
            <p className="text-sm text-white/40 mt-4">Across all properties</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          title="Recent Maintenance"
          columns={[
            { key: 'issue', label: 'Issue' },
            { key: 'priority', label: 'Priority' },
            { key: 'status', label: 'Status' },
          ]}
          data={maintenance}
        />
        <div className="glass-card neon-glow p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Alerts</h3>
          <div className="space-y-3">
            {[
              { text: '3 leases expiring within 30 days', level: 'warning' },
              { text: '2 critical maintenance requests open', level: 'error' },
              { text: 'Insurance renewal due Dec 15', level: 'info' },
              { text: 'Q4 tax filing deadline approaching', level: 'warning' },
            ].map((alert, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${
                alert.level === 'error' ? 'bg-red-500/10' : alert.level === 'warning' ? 'bg-yellow-500/10' : 'bg-[#00d4ff]/10'
              }`}>
                <AlertTriangle size={16} className={alert.level === 'error' ? 'text-red-400' : alert.level === 'warning' ? 'text-yellow-400' : 'text-[#00d4ff]'} />
                <span className="text-sm text-white/70">{alert.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
