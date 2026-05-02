export function SkeletonCard() {
  return (
    <div className="glass-card p-6">
      <div className="skeleton h-4 w-20 mb-4" />
      <div className="skeleton h-8 w-32 mb-2" />
      <div className="skeleton h-3 w-24" />
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <div className="skeleton h-5 w-40" />
      </div>
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="skeleton h-4 flex-1" />
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}
