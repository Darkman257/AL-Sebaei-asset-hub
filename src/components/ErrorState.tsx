import { AlertTriangle } from 'lucide-react'

interface ErrorStateProps {
  message: string
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="glass-card p-8 flex flex-col items-center justify-center gap-3">
      <AlertTriangle size={32} className="text-red-400" />
      <p className="text-sm text-red-400">{message}</p>
      <p className="text-xs text-white/30">Check your environment variables and network connection.</p>
    </div>
  )
}
