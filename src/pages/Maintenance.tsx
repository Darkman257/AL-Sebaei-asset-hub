import { Wrench, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import { SkeletonCard, SkeletonTable } from '../components/Skeleton'
import { supabase } from '../lib/supabase'

export default function Maintenance() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('maintenance_requests').select('*, units(unit_number, properties(name))').order('created_at', { ascending: false })
      .then(({ data, error: e }) => { if (e) setError(e.message); else setRequests(data || []); setLoading(false) })
  }, [])

  if (error) return <><PageHeader title="Maintenance" /><ErrorState message={error} /></>

  const tableData = requests.map(r => ({
    property: r.units?.properties?.name || '—',
    unit: r.units?.unit_number || '—',
    issue: r.issue,
    priority: r.priority,
    status: r.status,
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Maintenance" description="Track and manage maintenance requests" />
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#00d4ff]/10 text-[#00d4ff] rounded-xl hover:bg-[#00d4ff]/20 border border-[#00d4ff]/20 transition-colors">
          <Plus size={16} /> New Request
        </button>
      </div>
      {loading ? (
        <><div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div><SkeletonTable /></>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard icon={Wrench} title="Open" value={requests.filter(r => r.status === 'Open').length} delay={0} />
            <StatCard icon={Wrench} title="In Progress" value={requests.filter(r => r.status === 'In Progress').length} delay={1} />
            <StatCard icon={Wrench} title="Scheduled" value={requests.filter(r => r.status === 'Scheduled').length} delay={2} />
            <StatCard icon={Wrench} title="Completed" value={requests.filter(r => r.status === 'Completed').length} delay={3} />
          </div>
          <DataTable title="Maintenance Requests" columns={[
            { key: 'property', label: 'Property' }, { key: 'unit', label: 'Unit' },
            { key: 'issue', label: 'Issue' }, { key: 'priority', label: 'Priority' }, { key: 'status', label: 'Status' },
          ]} data={tableData} />
        </>
      )}
    </div>
  )
}
