import { useState } from 'react'
import { Upload, X, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface CSVImportProps {
  onClose: () => void
  onSuccess: () => void
}

export default function CSVImport({ onClose, onSuccess }: CSVImportProps) {
  const [csv, setCsv] = useState('')
  const [status, setStatus] = useState<'idle' | 'importing' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleImport = async () => {
    if (!csv.trim()) return
    setStatus('importing')

    try {
      const lines = csv.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim())
        const row: Record<string, any> = {}
        headers.forEach((h, i) => {
          const val = values[i]
          if (h === 'name') row.name = val
          else if (h === 'type') row.type = val
          else if (h === 'address') row.address = val
          else if (h === 'city') row.city = val
          else if (h === 'total_units' || h === 'units') row.total_units = parseInt(val) || 0
          else if (h === 'status') row.status = val
        })
        return row
      }).filter(r => r.name)

      const { error } = await supabase.from('properties').insert(rows)
      if (error) throw new Error(error.message)

      setStatus('done')
      setMessage(`${rows.length} properties imported successfully`)
      setTimeout(() => { onSuccess(); onClose() }, 1500)
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Import failed')
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setCsv(ev.target?.result as string || '')
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card neon-glow p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Import Properties (CSV)</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg"><X size={18} className="text-white/50" /></button>
        </div>

        <p className="text-xs text-white/40 mb-3">
          CSV format: <code className="text-[#00d4ff]">name,type,address,city,total_units,status</code>
        </p>

        <div className="mb-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors w-fit text-sm text-white/60">
            <Upload size={14} /> Upload CSV
            <input type="file" accept=".csv,.txt" onChange={handleFile} className="hidden" />
          </label>
        </div>

        <textarea
          value={csv}
          onChange={e => setCsv(e.target.value)}
          placeholder={`name,type,address,city,total_units,status\nSunrise Tower,Commercial,Main St,Riyadh,30,Active`}
          className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-[#00d4ff]/50 resize-none font-mono"
        />

        <div className="flex items-center justify-between mt-4">
          <div>
            {status === 'done' && <span className="flex items-center gap-2 text-sm text-green-400"><Check size={14} />{message}</span>}
            {status === 'error' && <span className="text-sm text-red-400">{message}</span>}
          </div>
          <button
            onClick={handleImport}
            disabled={status === 'importing' || !csv.trim()}
            className="px-4 py-2 bg-[#00d4ff]/20 text-[#00d4ff] rounded-xl hover:bg-[#00d4ff]/30 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === 'importing' ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  )
}
