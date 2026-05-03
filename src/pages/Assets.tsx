import { useState, useEffect } from 'react'
import { Plus, Upload } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import AnimatedNumber from '../components/AnimatedNumber'
import MiniProgress from '../components/MiniProgress'
import ErrorState from '../components/ErrorState'
import CSVImport from '../components/CSVImport'
import { SkeletonCard, SkeletonTable } from '../components/Skeleton'
import { supabase } from '../lib/supabase'

export default function Assets() {
  const [properties, setProperties] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showImport, setShowImport] = useState(false)

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

  if (error) return <><PageHeader title="Properties & Assets" /><ErrorState message={error} /></>

  const totalValue = units.reduce((s, u) => s + Number(u.monthly_rent || 0), 0) * 12
  const occupiedUnits = units.filter(u => u.status === 'Occupied').length
  const vacantUnits = units.filter(u => u.status === 'Vacant').length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Properties & Assets" description="Manage your real estate portfolio" />
        <div className="flex gap-3">
          <button onClick={() => setShowImport(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#a855f7]/10 text-[#a855f7] rounded-xl hover:bg-[#a855f7]/20 border border-[#a855f7]/20 transition-colors">
            <Upload size={16} /> Import CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#00d4ff]/10 text-[#00d4ff] rounded-xl hover:bg-[#00d4ff]/20 border border-[#00d4ff]/20 transition-colors">
            <Plus size={16} /> Add Property
          </button>
        </div>
      </div>

      {loading ? (
        <><div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div><SkeletonTable /></>
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

          {/* Property Cards with Progress */}
          <div className="glass-card neon-glow overflow-hidden mb-6 card-enter stagger-2">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Properties</h3>
              <span className="text-xs text-white/30 bg-white/5 px-2.5 py-1 rounded-full">{properties.length} properties</span>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {properties.map((p, i) => {
                const propUnits = units.filter(u => u.property_id === p.id)
                const propOccupied = propUnits.filter(u => u.status === 'Occupied').length
                const propTotal = propUnits.length || p.total_units
                const color = propTotal === 0 ? 'yellow' : (propOccupied / propTotal) >= 0.8 ? 'green' : (propOccupied / propTotal) >= 0.5 ? 'yellow' : 'red'
                
                return (
                  <div key={i} className="px-6 py-4 flex items-center gap-6 hover:bg-white/[0.02] transition-all even:bg-white/[0.01]">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 font-medium">{p.name}</p>
                      <p className="text-[11px] text-white/30 mt-0.5">{p.type} • {p.city}</p>
                    </div>
                    <div className="w-48">
                      <MiniProgress value={propOccupied} max={propTotal} color={color} />
                    </div>
                    <div className="text-right w-24">
                      <p className="text-xs text-white/60">{propOccupied}/{propTotal} units</p>
                    </div>
                    <span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
      {showImport && <CSVImport onClose={() => setShowImport(false)} onSuccess={fetchData} />}
    </div>
  )
}
