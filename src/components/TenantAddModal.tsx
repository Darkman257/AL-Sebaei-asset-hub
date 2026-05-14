import { useState, useEffect } from 'react'
import { X, Save, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface TenantAddModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function TenantAddModal({ onClose, onSuccess }: TenantAddModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'Individual',
    property_id: '',
    unit_id: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    monthly_rent: ''
  })

  const [properties, setProperties] = useState<any[]>([])
  const [allUnits, setAllUnits] = useState<any[]>([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadOptions() {
      try {
        const [propRes, unitRes] = await Promise.all([
          supabase.from('properties').select('id, name').order('name'),
          supabase.from('units').select('id, property_id, unit_number, status, monthly_rent').eq('status', 'Vacant').order('unit_number')
        ])
        setProperties(propRes.data || [])
        setAllUnits(unitRes.data || [])
      } catch (err) {
        console.error('Failed to load form selection indices', err)
      } finally {
        setLoadingOptions(false)
      }
    }
    loadOptions()
  }, [])

  const filteredUnits = allUnits.filter(u => u.property_id === formData.property_id)

  const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setFormData(prev => ({ ...prev, property_id: val, unit_id: '', monthly_rent: '' }))
  }

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    const selectedUnit = filteredUnits.find(u => u.id === val)
    setFormData(prev => ({ 
      ...prev, 
      unit_id: val, 
      monthly_rent: selectedUnit ? (selectedUnit.monthly_rent || '') : '' 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // 1. Insert the Tenant
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          type: formData.type,
          status: 'Active'
        })
        .select('id')
        .single()

      if (tenantError) throw tenantError
      if (!tenantData) throw new Error('Failed to retrieve newly generated tenant record.')

      // 2. Insert Lease and Link Unit if unit selected
      if (formData.unit_id) {
        const { error: leaseError } = await supabase
          .from('leases')
          .insert({
            tenant_id: tenantData.id,
            unit_id: formData.unit_id,
            start_date: formData.start_date,
            end_date: formData.end_date || null,
            monthly_rent: parseFloat(formData.monthly_rent.toString()) || null,
            status: 'Active'
          })

        if (leaseError) throw new Error(`Tenant registered, but lease record failed: ${leaseError.message}`)

        // 3. Update Unit Status to Occupied
        const { error: unitError } = await supabase
          .from('units')
          .update({ status: 'Occupied' })
          .eq('id', formData.unit_id)

        if (unitError) throw new Error(`Tenant & Lease registered, but unit status update failed: ${unitError.message}`)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Workflow processing failure.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-card neon-glow w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <div className="sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-xl z-10 px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Add Tenant</h2>
            <p className="text-xs text-white/40 mt-0.5">Initialize new tenancy profile and assign unit occupancy.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={20} className="text-white/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <h3 className="text-xs font-bold text-[#00d4ff] tracking-[0.2em] uppercase mb-4 ml-1">Tenant Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2.5">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
                placeholder="e.g. Ahmed Al-Rashid"
              />
            </div>
            
            <div className="space-y-2.5">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">Entity Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-colors appearance-none"
              >
                <option value="Individual">Individual</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">Phone Number</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
                placeholder="+966..."
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
                placeholder="tenant@domain.com"
              />
            </div>
          </div>

          <h3 className="text-xs font-bold text-[#00d4ff] tracking-[0.2em] uppercase mb-4 ml-1">Asset Allocation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2.5">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">Property Link</label>
              <select
                disabled={loadingOptions}
                value={formData.property_id}
                onChange={handlePropertyChange}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-colors appearance-none disabled:opacity-50"
              >
                <option value="">-- Unassigned --</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">Available Unit</label>
              <select
                disabled={loadingOptions || !formData.property_id}
                value={formData.unit_id}
                onChange={handleUnitChange}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-colors appearance-none disabled:opacity-50"
              >
                <option value="">-- Unassigned --</option>
                {filteredUnits.map(u => <option key={u.id} value={u.id}>Unit {u.unit_number}</option>)}
              </select>
            </div>
          </div>

          {formData.unit_id && (
            <>
              <h3 className="text-xs font-bold text-[#a855f7] tracking-[0.2em] uppercase mb-4 ml-1 animate-fade-in">Lease Aggreement Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2.5">
                  <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#a855f7]/50 transition-colors"
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#a855f7]/50 transition-colors"
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">Monthly Rent (EGP)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.monthly_rent}
                    onChange={e => setFormData({ ...formData, monthly_rent: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#a855f7]/50 transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#00d4ff]/20 border border-[#00d4ff]/30 text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-colors text-sm font-bold flex items-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(0,212,255,0.1)] hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
            >
              <Save size={16} />
              {saving ? 'Processing Workflow...' : 'Finalize Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
