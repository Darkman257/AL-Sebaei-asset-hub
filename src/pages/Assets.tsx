import { useState, useEffect } from 'react'
import { Building2, Plus, Upload } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import CSVImport from '../components/CSVImport'
import { supabase } from '../lib/supabase'

export default function Assets() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showImport, setShowImport] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setProperties(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const tableData = properties.map(p => ({
    name: p.name, type: p.type, units: p.total_units, city: p.city, status: p.status,
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Properties & Assets" description="Manage your real estate portfolio" />
        <div className="flex gap-3">
          <button onClick={() => setShowImport(true)} className="flex items-center gap-2 px-4 py-2 bg-[#a855f7]/10 text-[#a855f7] rounded-xl hover:bg-[#a855f7]/20 transition-colors">
            <Upload size={16} /> Import CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff]/10 text-[#00d4ff] rounded-xl hover:bg-[#00d4ff]/20 transition-colors">
            <Plus size={16} /> Add Property
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={Building2} title="Total Properties" value={properties.length} />
        <StatCard icon={Building2} title="Total Units" value={properties.reduce((s: number, p: any) => s + (p.total_units || 0), 0)} />
        <StatCard icon={Building2} title="Avg. Occupancy" value="88%" trend="up" change="+3%" />
      </div>
      {error ? <ErrorState message={error} /> : loading ? <p className="text-white/40">Loading...</p> : (
        <DataTable title="All Properties" columns={[
          { key: 'name', label: 'Property' }, { key: 'type', label: 'Type' },
          { key: 'units', label: 'Units' }, { key: 'city', label: 'City' }, { key: 'status', label: 'Status' },
        ]} data={tableData} />
      )}
      {showImport && <CSVImport onClose={() => setShowImport(false)} onSuccess={fetchData} />}
    </div>
  )
}
