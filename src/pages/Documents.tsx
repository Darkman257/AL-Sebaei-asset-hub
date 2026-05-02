import { FileText, Upload } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { documents } from '../lib/data'

export default function Documents() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Documents" description="Document management and storage" />
        <button className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff]/10 text-[#00d4ff] rounded-xl hover:bg-[#00d4ff]/20 transition-colors">
          <Upload size={16} /> Upload
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={FileText} title="Total Documents" value={47} />
        <StatCard icon={FileText} title="Contracts" value={18} />
        <StatCard icon={FileText} title="Storage Used" value="2.1 GB" />
      </div>

      <DataTable
        title="Recent Documents"
        columns={[
          { key: 'name', label: 'Document' },
          { key: 'type', label: 'Type' },
          { key: 'property', label: 'Property' },
          { key: 'date', label: 'Date' },
          { key: 'size', label: 'Size' },
        ]}
        data={documents}
      />
    </div>
  )
}
