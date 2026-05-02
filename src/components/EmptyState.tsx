import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  message?: string
  description?: string
}

export default function EmptyState({ message = 'No data yet', description = 'Data will appear here once available.' }: EmptyStateProps) {
  return (
    <div className="glass-card p-12 flex flex-col items-center justify-center gap-4">
      <div className="p-4 rounded-2xl bg-white/5">
        <Inbox size={32} className="text-white/20" />
      </div>
      <p className="text-sm text-white/50 font-medium">{message}</p>
      <p className="text-xs text-white/30">{description}</p>
    </div>
  )
}
