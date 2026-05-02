import { Building2, Plus } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { useQuery } from '../hooks/useSupabase'

export default function Assets() {
  const { data: properties, loading } = useQuery<any>('properties', { order: { column: 'created_at' } })

  const tableData = properties.map(p => ({
    name: p.name,
    type: p.type,
    units: p.total_units,
    city: p.city,
    status: p.status,
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Properties & Assets" description="Manage your real estate portfolio" />
        <button className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff]/10 text-[#00d4ff] rounded-xl hover:bg-[#00d4ff]/20 transition-colors">
          <Plus size={16} /> Add Property
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={Building2} title="Total Properties" value={properties.length} />
        <StatCard icon={Building2} title="Total Units" value={properties.reduce((s, p) => s + p.total_units, 0)} />
        <StatCard icon={Building2} title="Avg. Occupancy" value="88%" trend="up" change="+3%" />
      </div>
      {loading ? <p className="text-white/40">Loading...</p> : (
        <DataTable title="All Properties" columns={[
          { key: 'name', label: 'Property' }, { key: 'type', label: 'Type' },
          { key: 'units', label: 'Units' }, { key: 'city', label: 'City' }, { key: 'status', label: 'Status' },
        ]} data={tableData} />
      )}
    </div>
  )
}
