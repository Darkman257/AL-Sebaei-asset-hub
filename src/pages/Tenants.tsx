import { useState, useEffect } from 'react'
import { Users, Plus } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import { SkeletonCard, SkeletonTable } from '../components/Skeleton'
import TenantAddModal from '../components/TenantAddModal'
import { supabase } from '../lib/supabase'

export default function Tenants() {
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchErr } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false })
      if (fetchErr) throw fetchErr
      setTenants(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to query current tenants registry.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (error) return <><PageHeader title="Tenants" /><ErrorState message={error} /></>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Tenants" description="Manage tenants and lease agreements" />
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#00d4ff]/10 text-[#00d4ff] rounded-xl hover:bg-[#00d4ff]/20 border border-[#00d4ff]/20 transition-colors shadow-[0_0_15px_rgba(0,212,255,0.05)]"
        >
          <Plus size={16} /> Add Tenant
        </button>
      </div>

      {loading ? (
        <><div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div><SkeletonTable /></>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard icon={Users} title="Active Tenants" value={tenants.filter((t: any) => t.status === 'Active').length} trend="up" change="+12" delay={0} />
            <StatCard icon={Users} title="Corporate" value={tenants.filter((t: any) => t.type === 'Corporate').length} delay={1} />
            <StatCard icon={Users} title="Individual" value={tenants.filter((t: any) => t.type === 'Individual').length} delay={2} />
          </div>
          <DataTable title="All Tenants" columns={[
            { key: 'name', label: 'Name' }, { key: 'type', label: 'Type' },
            { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }, { key: 'status', label: 'Status' },
          ]} data={tenants} />
        </>
      )}

      {showAddModal && (
        <TenantAddModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={fetchData} 
        />
      )}
    </div>
  )
}
