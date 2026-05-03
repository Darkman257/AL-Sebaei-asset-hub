import { useState } from 'react'
import { X, Save, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface AssetEditModalProps {
  property: any
  onClose: () => void
  onSuccess: () => void
}

export default function AssetEditModal({ property, onClose, onSuccess }: AssetEditModalProps) {
  const [formData, setFormData] = useState({
    name: property.name || '',
    type: property.type || 'Residential',
    address: property.address || '',
    city: property.city || '',
    total_units: property.total_units || 0,
    status: property.status || 'Active',
    notes: property.notes || '',
    estimated_value: property.estimated_value || '',
    monthly_rent: property.monthly_rent || ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const { error: updateError } = await supabase
        .from('properties')
        .update({
          name: formData.name,
          type: formData.type,
          address: formData.address,
          city: formData.city,
          total_units: parseInt(formData.total_units.toString()),
          status: formData.status,
          notes: formData.notes,
          estimated_value: parseFloat(formData.estimated_value.toString()) || null,
          monthly_rent: parseFloat(formData.monthly_rent.toString()) || null
        })
        .eq('id', property.id)
      
      if (updateError) throw updateError
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to update property')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-card neon-glow w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <div className="sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-xl z-10 px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Edit Asset</h2>
            <p className="text-xs text-white/40 mt-0.5">Update details for {property.name}</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2.5">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">Asset Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>
            
            <div className="space-y-2.5">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">Asset Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-colors appearance-none"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Mixed Use">Mixed Use</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">Total Units</label>
              <input
                type="number"
                required
                min="0"
                value={formData.total_units}
                onChange={e => setFormData({ ...formData, total_units: parseInt(e.target.value) || 0 })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-colors appearance-none"
              >
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">Estimated Value (EGP)</label>
              <input
                type="number"
                min="0"
                value={formData.estimated_value}
                onChange={e => setFormData({ ...formData, estimated_value: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">Monthly Rent (EGP)</label>
              <input
                type="number"
                min="0"
                value={formData.monthly_rent}
                onChange={e => setFormData({ ...formData, monthly_rent: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2.5 mb-8">
            <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] ml-1 font-bold">Internal Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-colors resize-none"
              placeholder="Add any internal notes or details..."
            />
          </div>

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
              className="px-6 py-2.5 rounded-xl bg-[#00d4ff]/20 border border-[#00d4ff]/30 text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-colors text-sm font-bold flex items-center gap-2"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
