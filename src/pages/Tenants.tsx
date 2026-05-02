import { Users, Plus } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import { useQuery } from '../hooks/useSupabase'

export default function Tenants() {
  const { data: tenants, loading, error } = useQuery<any>('tenants', { order: { column: 'created_at' } })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Tenants" description="Manage tenants and lease agreements" />
        <button className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff]/10 text-[#00d4ff] rounded-xl hover:bg-[#00d4ff]/20 transition-colors">
          <Plus size={16} /> Add Tenant
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={Users} title="Active Tenants" value={tenants.filter((t: any) => t.status === 'Active').length} trend="up" change="+12" />
        <StatCard icon={Users} title="Corporate" value={tenants.filter((t: any) => t.type === 'Corporate').length} />
        <StatCard icon={Users} title="Individual" value={tenants.filter((t: any) => t.type === 'Individual').length} />
      </div>
      {error ? <ErrorState message={error} /> : loading ? <p className="text-white/40">Loading...</p> : (
        <DataTable title="All Tenants" columns={[
          { key: 'name', label: 'Name' }, { key: 'type', label: 'Type' },
          { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }, { key: 'status', label: 'Status' },
        ]} data={tenants} />
      )}
    </div>
  )
}
