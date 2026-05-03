import { Building2, MapPin, Edit3 } from 'lucide-react'
import MiniProgress from './MiniProgress'

interface AssetCardProps {
  property: any
  occupied: number
  total: number
  onEdit: (property: any) => void
}

export default function AssetCard({ property, occupied, total, onEdit }: AssetCardProps) {
  const occPct = total > 0 ? occupied / total : 0
  const color = total === 0 ? 'yellow' : occPct >= 0.8 ? 'green' : occPct >= 0.5 ? 'yellow' : 'red'

  return (
    <div className="glass-card neon-glow p-6 flex flex-col relative overflow-hidden group transition-all duration-300 hover:bg-white/[0.02]">
      <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-${color === 'green' ? 'green-400' : color === 'red' ? 'red-400' : 'yellow-400'}/40 to-transparent`} />
      
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#00d4ff]/30 transition-colors">
            <Building2 size={24} className="text-[#00d4ff]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-[#00d4ff] transition-colors">{property.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-white/40 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full">{property.type}</span>
              <span className="flex items-center gap-1 text-[11px] text-white/30">
                <MapPin size={10} /> {property.city}
              </span>
            </div>
          </div>
        </div>
        <span className={`badge badge-${property.status.toLowerCase()}`}>{property.status}</span>
      </div>

      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 transition-colors group-hover:bg-white/[0.04]">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-1 font-bold ml-1">Estimated Value</p>
            <p className="text-lg font-bold text-[#00d4ff]">EGP {Number(property.estimated_value || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 transition-colors group-hover:bg-white/[0.04]">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-1 font-bold ml-1">Monthly Rent</p>
            <p className="text-lg font-bold text-green-400">EGP {Number(property.monthly_rent || 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-1 font-bold ml-1">Occupancy</p>
              <p className="text-lg font-bold text-white leading-none">{occupied}<span className="text-sm text-white/40 font-normal"> / {total} units</span></p>
            </div>
            <p className="text-xs font-bold" style={{ color: color === 'green' ? '#4ade80' : color === 'red' ? '#f87171' : '#facc15' }}>
              {(occPct * 100).toFixed(0)}%
            </p>
          </div>
          <MiniProgress value={occupied} max={total} color={color} />
        </div>

        {property.notes && (
          <div className="text-xs text-white/40 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] italic">
            "{property.notes}"
          </div>
        )}
      </div>

      <button 
        onClick={() => onEdit(property)}
        className="mt-6 w-full py-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-white/60 hover:bg-white/10 hover:text-white flex items-center justify-center gap-2 transition-all text-sm font-medium"
      >
        <Edit3 size={14} /> Edit Asset Details
      </button>
    </div>
  )
}
