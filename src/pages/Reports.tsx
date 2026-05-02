import { BarChart3, Download } from 'lucide-react'
import PageHeader from '../components/PageHeader'

const reports = [
  { name: 'Monthly Revenue Report', period: 'November 2024', status: 'Ready', generated: '2024-12-01' },
  { name: 'Occupancy Analysis', period: 'Q4 2024', status: 'Ready', generated: '2024-11-30' },
  { name: 'Maintenance Summary', period: 'November 2024', status: 'Ready', generated: '2024-12-01' },
  { name: 'Expense Breakdown', period: 'November 2024', status: 'Processing', generated: '—' },
  { name: 'Annual Tax Report', period: '2024', status: 'Scheduled', generated: '—' },
]

export default function Reports() {
  return (
    <div>
      <PageHeader title="Reports" description="Generate and download property reports" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card neon-glow p-6 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-white">12</p>
            <p className="text-sm text-white/40">Reports Generated</p>
          </div>
          <BarChart3 size={24} className="text-[#00d4ff]" />
        </div>
        <div className="glass-card neon-glow p-6 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-sm text-white/40">Scheduled</p>
          </div>
          <BarChart3 size={24} className="text-[#a855f7]" />
        </div>
        <div className="glass-card neon-glow p-6 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-white">Weekly</p>
            <p className="text-sm text-white/40">Auto-generation</p>
          </div>
          <BarChart3 size={24} className="text-green-400" />
        </div>
      </div>

      <div className="glass-card neon-glow overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">Available Reports</h3>
        </div>
        <div className="divide-y divide-white/5">
          {reports.map((report, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div>
                <p className="text-sm text-white/80">{report.name}</p>
                <p className="text-xs text-white/40">{report.period} • Generated: {report.generated}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  report.status === 'Ready' ? 'bg-green-500/10 text-green-400' :
                  report.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-white/5 text-white/40'
                }`}>{report.status}</span>
                {report.status === 'Ready' && (
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <Download size={16} className="text-[#00d4ff]" />
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
