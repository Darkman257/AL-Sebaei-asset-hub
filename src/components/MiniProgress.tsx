interface MiniProgressProps {
  value: number
  max: number
  color?: 'blue' | 'green' | 'red' | 'yellow'
}

export default function MiniProgress({ value, max, color = 'blue' }: MiniProgressProps) {
  const pct = max > 0 ? (value / max) * 100 : 0
  const colors = {
    blue: 'from-[#00d4ff] to-[#00d4ff]/60',
    green: 'from-green-400 to-green-400/60',
    red: 'from-red-400 to-red-400/60',
    yellow: 'from-yellow-400 to-yellow-400/60',
  }
  const glows = {
    blue: 'shadow-[0_0_8px_rgba(0,212,255,0.4)]',
    green: 'shadow-[0_0_8px_rgba(34,197,94,0.4)]',
    red: 'shadow-[0_0_8px_rgba(239,68,68,0.4)]',
    yellow: 'shadow-[0_0_8px_rgba(250,204,21,0.4)]',
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${colors[color]} ${glows[color]} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-white/40 w-10 text-right">{pct.toFixed(0)}%</span>
    </div>
  )
}
