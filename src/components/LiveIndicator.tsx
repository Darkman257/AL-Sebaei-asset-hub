export default function LiveIndicator() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/20">
        <div className="relative">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75" />
        </div>
        <span className="text-[11px] text-green-400 font-medium">LIVE</span>
      </div>
      <span className="text-[11px] text-white/25">Updated just now</span>
    </div>
  )
}
