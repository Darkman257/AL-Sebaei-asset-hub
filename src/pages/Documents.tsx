import { FileText, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { supabase } from '../lib/supabase'

export default function Documents() {
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('documents').select('*, properties(name)').order('created_at', { ascending: false })
      .then(({ data }) => { setDocs(data || []); setLoading(false) })
  }, [])

  const formatSize = (bytes: number) => bytes ? `${(bytes / 1048576).toFixed(1)} MB` : '—'

  const tableData = docs.map(d => ({
    name: d.name,
    type: d.type,
    property: d.properties?.name || 'All Properties',
    size: formatSize(d.file_size_bytes),
    status: d.status,
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Documents" description="Document management and storage" />
        <button className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff]/10 text-[#00d4ff] rounded-xl hover:bg-[#00d4ff]/20 transition-colors">
          <Upload size={16} /> Upload
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={FileText} title="Total Documents" value={docs.length} />
        <StatCard icon={FileText} title="Contracts" value={docs.filter(d => d.type === 'Contract').length} />
        <StatCard icon={FileText} title="Storage Used" value={formatSize(docs.reduce((s, d) => s + (d.file_size_bytes || 0), 0))} />
      </div>
      {loading ? <p className="text-white/40">Loading...</p> : (
        <DataTable title="All Documents" columns={[
          { key: 'name', label: 'Document' }, { key: 'type', label: 'Type' },
          { key: 'property', label: 'Property' }, { key: 'size', label: 'Size' }, { key: 'status', label: 'Status' },
        ]} data={tableData} />
      )}
    </div>
  )
}
