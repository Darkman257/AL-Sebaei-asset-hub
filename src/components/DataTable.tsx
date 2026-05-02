import StatusBadge from './StatusBadge'
import EmptyState from './EmptyState'

interface Column {
  key: string
  label: string
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, any>[]
  title?: string
}

const statusFields = ['status', 'priority']

export default function DataTable({ columns, data, title }: DataTableProps) {
  if (data.length === 0) return <EmptyState />

  return (
    <div className="glass-card neon-glow overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <span className="text-xs text-white/30 bg-white/5 px-2.5 py-1 rounded-full">{data.length} records</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map(col => (
                <th key={col.key} className="px-6 py-3.5 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-white/[0.03] transition-colors duration-200 even:bg-white/[0.01]">
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 text-sm text-white/70">
                    {statusFields.includes(col.key) ? (
                      <StatusBadge status={row[col.key]} />
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
