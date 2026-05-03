import { useState, useEffect } from 'react'
import { Plus, Upload, Download } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import AnimatedNumber from '../components/AnimatedNumber'
import ErrorState from '../components/ErrorState'
import CSVImport from '../components/CSVImport'
import AssetCard from '../components/AssetCard'
import AssetEditModal from '../components/AssetEditModal'
import { SkeletonCard } from '../components/Skeleton'
import { supabase } from '../lib/supabase'

export default function Assets() {
  const [properties, setProperties] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [editingAsset, setEditingAsset] = useState<any | null>(null)

  const fetchData = async () => {
    setLoading(true)
    const [propRes, unitRes] = await Promise.all([
      supabase.from('properties').select('*').order('created_at', { ascending: false }),
      supabase.from('units').select('id, property_id, status, monthly_rent'),
    ])
    if (propRes.error) setError(propRes.error.message)
    else { setProperties(propRes.data || []); setUnits(unitRes.data || []) }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleExport = () => {
    const headers = ['name', 'type', 'address', 'city', 'total_units', 'status', 'notes', 'estimated_value', 'monthly_rent']
    const rows = properties.length > 0 ? properties.map(p => 
      headers.map(h => {
        const val = p[h]
        if (val === null || val === undefined) return ''
        if (typeof val === 'string' && val.includes(',')) return `"${val}"`
        return val
      }).join(',')
    ) : []
    
    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `properties_export_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (error) return <><PageHeader title="Properties & Assets" /><ErrorState message={error} /></>

  const totalValue = properties.reduce((s, p) => s + Number(p.estimated_value || 0), 0) || units.reduce((s, u) => s + Number(u.monthly_rent || 0), 0) * 12
  const occupiedUnits = units.filter(u => u.status === 'Occupied').length
  const vacantUnits = units.filter(u => u.status === 'Vacant').length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Properties & Assets" description="Manage your real estate portfolio" />
        <div className="flex gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-white/5 text-white/80 rounded-xl hover:bg-white/10 border border-white/10 transition-colors">
            <Download size={16} /> Export CSV Template
          </button>
          <button onClick={() => setShowImport(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#a855f7]/10 text-[#a855f7] rounded-xl hover:bg-[#a855f7]/20 border border-[#a855f7]/20 transition-colors">
            <Upload size={16} /> Import CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#00d4ff]/10 text-[#00d4ff] rounded-xl hover:bg-[#00d4ff]/20 border border-[#00d4ff]/20 transition-colors">
            <Plus size={16} /> Add Property
          </button>
        </div>
      </div>

      {loading ? (
        <><div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div></>
      ) : (
        <>
          {/* Portfolio Value Header */}
          <div className="glass-card neon-glow p-6 mb-6 card-enter relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">Estimated Annual Portfolio Value</p>
                <p className="text-3xl font-bold text-green-400">
                  <AnimatedNumber value={totalValue} prefix="EGP " decimals={0} />
                </p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-green-400">{occupiedUnits}</p>
                  <p className="text-[10px] text-white/30">Occupied</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-red-400">{vacantUnits}</p>
                  <p className="text-[10px] text-white/30">Vacant</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{units.length}</p>
                  <p className="text-[10px] text-white/30">Total Units</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 mt-8">
            <h3 className="text-lg font-semibold text-white tracking-wide">Asset Control Panel</h3>
            <span className="text-xs text-[#00d4ff] bg-[#00d4ff]/10 px-3 py-1.5 rounded-full font-medium border border-[#00d4ff]/20">
              {properties.length} Active Assets
            </span>
          </div>

          {/* Property Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 card-enter stagger-2">
            {properties.map((p, i) => {
              const propUnits = units.filter(u => u.property_id === p.id)
              const propOccupied = propUnits.filter(u => u.status === 'Occupied').length
              const propTotal = propUnits.length || p.total_units
              
              return (
                <AssetCard 
                  key={i} 
                  property={p} 
                  occupied={propOccupied} 
                  total={propTotal} 
                  onEdit={(prop) => setEditingAsset(prop)} 
                />
              )
            })}
          </div>
        </>
      )}
      {showImport && <CSVImport onClose={() => setShowImport(false)} onSuccess={fetchData} />}
      {editingAsset && (
        <AssetEditModal 
          property={editingAsset} 
          onClose={() => setEditingAsset(null)} 
          onSuccess={() => { setEditingAsset(null); fetchData() }} 
        />
      )}
    </div>
  )
}
