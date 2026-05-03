import { BarChart3, Download, Clock, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { supabase } from '../lib/supabase'

const reportsList = [
  { name: 'Monthly Revenue Report', period: 'November 2024', status: 'Ready', generated: '2024-12-01' },
  { name: 'Occupancy Analysis', period: 'Q4 2024', status: 'Ready', generated: '2024-11-30' },
  { name: 'Maintenance Summary', period: 'November 2024', status: 'Ready', generated: '2024-12-01' },
  { name: 'Expense Breakdown', period: 'November 2024', status: 'Processing', generated: '—' },
  { name: 'Annual Tax Report', period: '2024', status: 'Scheduled', generated: '—' },
]

export default function Reports() {
  const [stats, setStats] = useState({ properties: 0, units: 0, maintenance: 0 })

  useEffect(() => {
    async function fetchStats() {
      const [propRes, unitRes, maintRes] = await Promise.all([
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('units').select('id', { count: 'exact', head: true }),
        supabase.from('maintenance_requests').select('id', { count: 'exact', head: true }).eq('status', 'Pending')
      ])
      
      setStats({
        properties: propRes.count || 0,
        units: unitRes.count || 0,
        maintenance: maintRes.count || 0
      })
    }
    fetchStats()
  }, [])

  return (
    <div>
      <PageHeader title="Reports" description="Generate and download property reports" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card neon-glow p-6 flex items-center justify-between card-enter stagger-1">
          <div><p className="text-2xl font-bold text-white animate-number">{stats.properties + stats.units}</p><p className="text-sm text-white/40 mt-1">Data Points Analyzed</p></div>
          <div className="p-3 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/10"><BarChart3 size={22} className="text-[#00d4ff]" /></div>
        </div>
        <div className="glass-card neon-glow p-6 flex items-center justify-between card-enter stagger-2">
          <div><p className="text-2xl font-bold text-white animate-number">{stats.maintenance}</p><p className="text-sm text-white/40 mt-1">Pending Maintenance</p></div>
          <div className="p-3 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/10"><Clock size={22} className="text-[#a855f7]" /></div>
        </div>
        <div className="glass-card neon-glow p-6 flex items-center justify-between card-enter stagger-3">
          <div><p className="text-2xl font-bold text-white animate-number">Live</p><p className="text-sm text-white/40 mt-1">Data Sync Status</p></div>
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/10"><CheckCircle2 size={22} className="text-green-400" /></div>
        </div>
      </div>
      <div className="glass-card neon-glow overflow-hidden card-enter stagger-3">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Available Reports</h3>
          <span className="text-xs text-white/30 bg-white/5 px-2.5 py-1 rounded-full">{reportsList.length} reports</span>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {reportsList.map((report, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.03] transition-all duration-200 even:bg-white/[0.01]">
              <div>
                <p className="text-sm text-white/80 font-medium">{report.name}</p>
                <p className="text-xs text-white/30 mt-0.5">{report.period} • Generated: {report.generated}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${
                  report.status === 'Ready' ? 'badge-completed' : report.status === 'Processing' ? 'badge-pending' : 'badge-scheduled'
                }`}>{report.status}</span>
                {report.status === 'Ready' && (
                  <button className="p-2 hover:bg-[#00d4ff]/10 rounded-lg transition-colors border border-transparent hover:border-[#00d4ff]/20">
                    <Download size={15} className="text-[#00d4ff]" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
