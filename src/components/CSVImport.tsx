import { useState } from 'react'
import { Upload, X, Check, AlertTriangle } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface CSVImportProps {
  onClose: () => void
  onSuccess: () => void
}

export default function CSVImport({ onClose, onSuccess }: CSVImportProps) {
  const [csv, setCsv] = useState('')
  const [replaceMode, setReplaceMode] = useState(false)
  const [status, setStatus] = useState<'idle' | 'importing' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleImport = async () => {
    if (!csv.trim()) return
    setStatus('importing')

    try {
      const lines = csv.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      
      const rows = lines.slice(1).map(line => {
        const values: string[] = []
        let currentVal = ''
        let inQuotes = false
        
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '"') {
            inQuotes = !inQuotes
          } else if (line[i] === ',' && !inQuotes) {
            values.push(currentVal.trim())
            currentVal = ''
          } else {
            currentVal += line[i]
          }
        }
        values.push(currentVal.trim())

        const row: Record<string, any> = {}
        headers.forEach((h, i) => {
          const val = values[i]
          if (val !== undefined && val !== '') {
            if (h === 'name') row.name = val
            else if (h === 'type') row.type = val
            else if (h === 'address') row.address = val
            else if (h === 'city') row.city = val
            else if (h === 'total_units' || h === 'units') row.total_units = parseInt(val) || 0
            else if (h === 'status') row.status = val
            else if (h === 'notes') row.notes = val
            else if (h === 'estimated_value') row.estimated_value = parseFloat(val) || null
            else if (h === 'monthly_rent') row.monthly_rent = parseFloat(val) || null
          }
        })
        return row
      }).filter(r => r.name)

      if (replaceMode) {
        const { error: deleteError } = await supabase.from('properties').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        if (deleteError) throw new Error(`Failed to clear old data: ${deleteError.message}`)
      }

      if (rows.length > 0) {
        const { error } = await supabase.from('properties').insert(rows)
        if (error) throw new Error(`Failed to insert data: ${error.message}`)
      }

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-card neon-glow p-6 w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Import Properties (CSV)</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg"><X size={18} className="text-white/50" /></button>
        </div>

        <p className="text-xs text-white/40 mb-3">
          CSV format: <code className="text-[#00d4ff]">name,type,address,city,total_units,status,notes,estimated_value,monthly_rent</code>
        </p>

        <div className="mb-4 flex items-center justify-between">
          <label className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors w-fit text-sm text-white/60">
            <Upload size={14} /> Upload CSV File
            <input type="file" accept=".csv,.txt" onChange={handleFile} className="hidden" />
          </label>
          
          <label className="flex items-center gap-2 text-sm text-red-400 cursor-pointer bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors">
            <input 
              type="checkbox" 
              checked={replaceMode}
              onChange={(e) => setReplaceMode(e.target.checked)}
              className="accent-red-500 w-4 h-4 rounded border-white/20 bg-black/50"
            />
            Replace existing data
          </label>
        </div>

        {replaceMode && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-400 text-xs">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <p><strong>Warning:</strong> Replace mode is enabled. All existing properties will be permanently deleted before the new CSV is imported. Use this only for complete data resets.</p>
          </div>
        )}

        <textarea
          value={csv}
          onChange={e => setCsv(e.target.value)}
          placeholder={`name,type,address,city,total_units,status,notes,estimated_value,monthly_rent\nSunrise Tower,Commercial,Main St,Riyadh,30,Active,Prime location,12000000,5000`}
          className="w-full h-40 bg-[#111] border border-white/10 rounded-xl p-4 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-[#00d4ff]/50 resize-none font-mono"
        />

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div>
            {status === 'done' && <span className="flex items-center gap-2 text-sm text-green-400"><Check size={14} />{message}</span>}
            {status === 'error' && <span className="text-sm text-red-400">{message}</span>}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={status === 'importing'}
              className="px-6 py-2 bg-transparent text-white/50 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={status === 'importing' || !csv.trim()}
              className="px-6 py-2.5 bg-[#00d4ff]/20 border border-[#00d4ff]/30 text-[#00d4ff] rounded-xl hover:bg-[#00d4ff]/30 transition-colors text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,212,255,0.15)] hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
            >
              {status === 'importing' ? 'Importing...' : replaceMode ? 'Replace & Import' : 'Import Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
