import { FileText, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import { SkeletonCard, SkeletonTable } from '../components/Skeleton'
import { supabase } from '../lib/supabase'

export default function Documents() {
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('documents').select('*, properties(name)').order('created_at', { ascending: false })
      .then(({ data, error: e }) => { if (e) setError(e.message); else setDocs(data || []); setLoading(false) })
  }, [])

  if (error) return <><PageHeader title="Documents" /><ErrorState message={error} /></>
  const formatSize = (bytes: number) => bytes ? `${(bytes / 1048576).toFixed(1)} MB` : '—'

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Documents" description="Document management and storage" />
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#00d4ff]/10 text-[#00d4ff] rounded-xl hover:bg-[#00d4ff]/20 border border-[#00d4ff]/20 transition-colors">
          <Upload size={16} /> Upload
        </button>
      </div>
      {loading ? (
        <><div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div><SkeletonTable /></>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard icon={FileText} title="Total Documents" value={docs.length} delay={0} />
            <StatCard icon={FileText} title="Contracts" value={docs.filter(d => d.type === 'Contract').length} delay={1} />
            <StatCard icon={FileText} title="Storage Used" value={formatSize(docs.reduce((s, d) => s + (d.file_size_bytes || 0), 0))} delay={2} />
          </div>
          <DataTable title="All Documents" columns={[
            { key: 'name', label: 'Document' }, { key: 'type', label: 'Type' },
            { key: 'property', label: 'Property' }, { key: 'size', label: 'Size' }, { key: 'status', label: 'Status' },
          ]} data={docs.map(d => ({
            name: d.name, type: d.type, property: d.properties?.name || 'All Properties',
            size: formatSize(d.file_size_bytes), status: d.status,
          }))} />
        </>
      )}
    </div>
  )
}
