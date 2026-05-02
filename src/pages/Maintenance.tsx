import { Wrench, Plus } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { maintenanceRequests } from '../lib/data'

export default function Maintenance() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Maintenance" description="Track and manage maintenance requests" />
        <button className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff]/10 text-[#00d4ff] rounded-xl hover:bg-[#00d4ff]/20 transition-colors">
          <Plus size={16} /> New Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Wrench} title="Open Requests" value={3} />
        <StatCard icon={Wrench} title="In Progress" value={1} />
        <StatCard icon={Wrench} title="Completed (Month)" value={12} />
        <StatCard icon={Wrench} title="Avg. Resolution" value="3.2 days" />
      </div>

      <DataTable
        title="Maintenance Requests"
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'property', label: 'Property' },
          { key: 'unit', label: 'Unit' },
          { key: 'issue', label: 'Issue' },
          { key: 'priority', label: 'Priority' },
          { key: 'status', label: 'Status' },
          { key: 'date', label: 'Date' },
        ]}
        data={maintenanceRequests}
      />
    </div>
  )
}
