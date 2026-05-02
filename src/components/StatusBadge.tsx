interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cls = status.toLowerCase().replace(/\s+/g, '-')
  return <span className={`badge badge-${cls}`}>{status}</span>
}
