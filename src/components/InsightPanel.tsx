import { Brain } from 'lucide-react'

interface Insight {
  icon: any
  text: string
  type: 'info' | 'warning' | 'success' | 'danger'
}

interface InsightPanelProps {
  insights: Insight[]
}

export default function InsightPanel({ insights }: InsightPanelProps) {
  const colors = {
    info: { bg: 'from-[#00d4ff]/5 to-transparent', border: 'border-[#00d4ff]/20', text: 'text-[#00d4ff]', glow: 'shadow-[0_0_20px_rgba(0,212,255,0.1)]' },
    success: { bg: 'from-green-500/5 to-transparent', border: 'border-green-500/20', text: 'text-green-400', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.1)]' },
    warning: { bg: 'from-yellow-500/5 to-transparent', border: 'border-yellow-500/20', text: 'text-yellow-400', glow: 'shadow-[0_0_20px_rgba(250,204,21,0.1)]' },
    danger: { bg: 'from-red-500/5 to-transparent', border: 'border-red-500/20', text: 'text-red-400', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.1)]' },
  }

  return (
    <div className="glass-card neon-glow p-6 mb-8 card-enter relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff]/40 to-transparent" />
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/20">
          <Brain size={18} className="text-[#a855f7]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Business Intelligence</h3>
          <p className="text-[10px] text-white/30">Real-time insights from your portfolio</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, i) => {
          const c = colors[insight.type]
          return (
            <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r ${c.bg} border ${c.border} ${c.glow} transition-all duration-300 hover:scale-[1.01]`}>
              <insight.icon size={15} className={c.text} />
              <span className="text-sm text-white/70">{insight.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
