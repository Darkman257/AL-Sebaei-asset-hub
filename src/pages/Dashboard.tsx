import { Building2, TrendingUp, AlertTriangle, ArrowUpRight, DollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import AnimatedNumber from '../components/AnimatedNumber'
import InsightPanel from '../components/InsightPanel'
import LiveIndicator from '../components/LiveIndicator'
import DataTable from '../components/DataTable'
import { SkeletonCard, SkeletonTable } from '../components/Skeleton'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [maintenance, setMaintenance] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [propRes, unitRes, tenantRes, revRes, expRes, maintRes] = await Promise.all([
        supabase.from('properties').select('id, total_units', { count: 'exact' }),
        supabase.from('units').select('id, status, monthly_rent'),
        supabase.from('tenants').select('id', { count: 'exact', head: true }).eq('status', 'Active'),
        supabase.from('revenue').select('amount').eq('status', 'Received'),
        supabase.from('expenses').select('amount'),
        supabase.from('maintenance_requests').select('id, issue, priority, status').limit(4),
      ])
      
      const units = unitRes.data || []
      const occupied = units.filter(u => u.status === 'Occupied').length
      const vacant = units.filter(u => u.status === 'Vacant').length
      const totalUnits = units.length
      const potentialRev = units.reduce((s, u) => s + Number(u.monthly_rent || 0), 0)
      const lostRev = units.filter(u => u.status === 'Vacant').reduce((s, u) => s + Number(u.monthly_rent || 0), 0)
      const totalRev = revRes.data?.reduce((sum, r) => sum + Number(r.amount), 0) || 0
      const totalExp = expRes.data?.reduce((sum, e) => sum + Number(e.amount), 0) || 0

      setStats({
        properties: propRes.count || 0,
        totalUnits,
        occupied,
        vacant,
        tenants: tenantRes.count || 0,
        revenue: totalRev,
        expenses: totalExp,
        potentialRev,
        lostRev,
      })
      setMaintenance(maintRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div>
      <PageHeader title="Dashboard" description="Command Center" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <SkeletonTable />
    </div>
  )

  const occupancyPct = stats.totalUnits > 0 ? (stats.occupied / stats.totalUnits) * 100 : 0

  const insights = [
    { icon: Building2, text: `${stats.properties} active properties with ${stats.totalUnits} total units under management`, type: 'info' as const },
    { icon: TrendingUp, text: `Potential monthly revenue: EGP ${(stats.potentialRev/1000).toFixed(0)}K at full occupancy`, type: 'success' as const },
    { icon: AlertTriangle, text: `${stats.vacant} vacant units → EGP ${(stats.lostRev/1000).toFixed(0)}K/mo lost revenue opportunity`, type: stats.vacant > 2 ? 'danger' as const : 'warning' as const },
    { icon: DollarSign, text: `Net position: EGP ${((stats.revenue - stats.expenses)/1000).toFixed(0)}K (Revenue minus Expenses)`, type: stats.revenue > stats.expenses ? 'success' as const : 'danger' as const },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-white/35 mt-1.5 text-sm">Real-time portfolio intelligence</p>
        </div>
        <LiveIndicator />
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Properties', value: stats.properties, color: 'blue', pulse: false },
          { label: 'Total Units', value: stats.totalUnits, color: 'blue', pulse: false },
          { label: 'Occupied', value: stats.occupied, color: 'green', pulse: true },
          { label: 'Vacant', value: stats.vacant, color: stats.vacant > 2 ? 'red' : 'yellow', pulse: stats.vacant > 2 },
          { label: 'Revenue', value: stats.revenue, prefix: 'EGP ', format: 'short', color: 'green', pulse: false },
          { label: 'Expenses', value: stats.expenses, prefix: 'EGP ', format: 'short', color: 'red', pulse: false },
        ].map((kpi, i) => {
          const glowMap: Record<string, string> = {
            blue: 'border-[#00d4ff]/20 shadow-[0_0_20px_rgba(0,212,255,0.08)]',
            green: 'border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.08)]',
            red: 'border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.08)]',
            yellow: 'border-yellow-500/20 shadow-[0_0_20px_rgba(250,204,21,0.08)]',
          }
          const textMap: Record<string, string> = { blue: 'text-[#00d4ff]', green: 'text-green-400', red: 'text-red-400', yellow: 'text-yellow-400' }
          const displayVal = kpi.format === 'short' ? kpi.value / 1000 : kpi.value

          return (
            <div key={i} className={`glass-card p-4 border ${glowMap[kpi.color]} card-enter stagger-${Math.min(i+1,4)} relative overflow-hidden`}>
              {kpi.pulse && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-current animate-pulse" style={{ color: kpi.color === 'red' ? '#f87171' : '#facc15' }} />}
              <p className={`text-2xl font-bold ${textMap[kpi.color]}`}>
                <AnimatedNumber value={displayVal} prefix={kpi.prefix || ''} suffix={kpi.format === 'short' ? 'K' : ''} decimals={kpi.format === 'short' ? 0 : 0} />
              </p>
              <p className="text-[11px] text-white/35 mt-1 uppercase tracking-wider">{kpi.label}</p>
            </div>
          )
        })}
      </div>

      {/* Insight Panel */}
      <InsightPanel insights={insights} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue vs Expenses */}
        <div className="lg:col-span-2 glass-card neon-glow p-6 card-enter stagger-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Revenue vs Expenses</h3>
            <span className="flex items-center gap-1 text-xs text-green-400"><ArrowUpRight size={12} /> Net Positive</span>
          </div>
          <div className="flex items-end gap-6 h-44">
            {[
              { label: 'Jun', rev: 62, exp: 25 }, { label: 'Jul', rev: 68, exp: 30 },
              { label: 'Aug', rev: 72, exp: 28 }, { label: 'Sep', rev: 75, exp: 32 },
              { label: 'Oct', rev: 78, exp: 27 }, { label: 'Nov', rev: 85, exp: 35 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex gap-1 items-end h-36">
                  <div className="flex-1 rounded-t-md bg-gradient-to-t from-[#00d4ff]/30 to-[#00d4ff]/70 group-hover:to-[#00d4ff]/90 transition-all duration-300 relative" style={{ height: `${d.rev}%` }}>
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-white/0 group-hover:text-[#00d4ff] transition-all whitespace-nowrap">{(d.rev * 15).toLocaleString()}K</div>
                  </div>
                  <div className="flex-1 rounded-t-md bg-gradient-to-t from-red-500/20 to-red-500/50 group-hover:to-red-500/70 transition-all duration-300" style={{ height: `${d.exp}%` }} />
                </div>
                <span className="text-[10px] text-white/30">{d.label}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-6 mt-4 pt-4 border-t border-white/[0.04]">
            <div className="flex items-center gap-2"><div className="w-3 h-1.5 rounded-full bg-[#00d4ff]" /><span className="text-[10px] text-white/40">Revenue</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-1.5 rounded-full bg-red-400" /><span className="text-[10px] text-white/40">Expenses</span></div>
          </div>
        </div>

        {/* Occupancy Donut */}
        <div className="glass-card neon-glow p-6 card-enter stagger-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Occupancy</h3>
          <div className="flex flex-col items-center justify-center h-44">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90">
                <circle cx="72" cy="72" r="58" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="14" />
                <circle cx="72" cy="72" r="58" fill="none" stroke="url(#occGrad)" strokeWidth="14"
                  strokeDasharray={`${occupancyPct * 3.64} ${100 * 3.64}`} strokeLinecap="round"
                  className="drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]" style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1)' }} />
                <defs>
                  <linearGradient id="occGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white"><AnimatedNumber value={occupancyPct} decimals={0} suffix="%" /></span>
                <span className="text-[10px] text-white/25 mt-0.5">occupied</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="text-center"><p className="text-sm font-semibold text-green-400">{stats.occupied}</p><p className="text-[10px] text-white/30">Occupied</p></div>
            <div className="text-center"><p className="text-sm font-semibold text-red-400">{stats.vacant}</p><p className="text-[10px] text-white/30">Vacant</p></div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-enter stagger-3">
          <DataTable title="Active Maintenance" columns={[
            { key: 'issue', label: 'Issue' }, { key: 'priority', label: 'Priority' }, { key: 'status', label: 'Status' },
          ]} data={maintenance} />
        </div>
        
        <div className="glass-card neon-glow p-6 card-enter stagger-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Alerts</h3>
          <div className="space-y-3">
            {[
              { text: '3 leases expiring within 30 days', level: 'warning' },
              { text: `${stats.vacant} vacant units generating no income`, level: 'error' },
              { text: 'Insurance renewal due Dec 15', level: 'info' },
              { text: `Collection rate: ${stats.revenue > 0 ? '96.5' : '0'}%`, level: 'success' },
            ].map((alert, i) => (
              <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 hover:scale-[1.01] cursor-default ${
                alert.level === 'error' ? 'bg-red-500/5 border-red-500/15' :
                alert.level === 'warning' ? 'bg-yellow-500/5 border-yellow-500/15' :
                alert.level === 'success' ? 'bg-green-500/5 border-green-500/15' : 'bg-[#00d4ff]/5 border-[#00d4ff]/15'
              }`}>
                <AlertTriangle size={13} className={
                  alert.level === 'error' ? 'text-red-400' : alert.level === 'warning' ? 'text-yellow-400' :
                  alert.level === 'success' ? 'text-green-400' : 'text-[#00d4ff]'
                } />
                <span className="text-[13px] text-white/60">{alert.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
