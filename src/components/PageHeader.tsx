interface PageHeaderProps {
  title: string
  description?: string
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
      {description && <p className="text-white/35 mt-1.5 text-sm">{description}</p>}
    </div>
  )
}
