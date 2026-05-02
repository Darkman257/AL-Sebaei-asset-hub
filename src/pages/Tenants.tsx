import { Users, Plus } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { tenants } from '../lib/data'

export default function Tenants() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Tenants" description="Manage tenants and lease agreements" />
        <button className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff]/10 text-[#00d4ff] rounded-xl hover:bg-[#00d4ff]/20 transition-colors">
          <Plus size={16} /> Add Tenant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={Users} title="Active Tenants" value={138} trend="up" change="+12" />
        <StatCard icon={Users} title="Lease Renewals Due" value={8} />
        <StatCard icon={Users} title="Avg. Tenant Rating" value="4.6/5" />
      </div>

      <DataTable
        title="All Tenants"
        columns={[
          { key: 'name', label: 'Tenant' },
          { key: 'property', label: 'Property' },
          { key: 'unit', label: 'Unit' },
          { key: 'rent', label: 'Rent' },
          { key: 'status', label: 'Status' },
        ]}
        data={tenants}
      />
    </div>
  )
}
