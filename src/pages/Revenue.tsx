import { TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import { SkeletonCard, SkeletonTable } from '../components/Skeleton'
import { supabase } from '../lib/supabase'

export default function Revenue() {
  const [revenue, setRevenue] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('revenue').select('*, properties(name)').order('date', { ascending: false })
      .then(({ data, error: e }) => { if (e) setError(e.message); else setRevenue(data || []); setLoading(false) })
  }, [])

  if (error) return <><PageHeader title="Revenue" /><ErrorState message={error} /></>

  const total = revenue.reduce((s, r) => s + Number(r.amount), 0)
  const rental = revenue.filter(r => r.type === 'Rental').reduce((s, r) => s + Number(r.amount), 0)
  const services = revenue.filter(r => r.type === 'Service').reduce((s, r) => s + Number(r.amount), 0)
  const received = revenue.filter(r => r.status === 'Received').reduce((s, r) => s + Number(r.amount), 0)

  return (
    <div>
      <PageHeader title="Revenue" description="Income streams and financial performance" />
      {loading ? (
        <><div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div><SkeletonTable /></>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard icon={TrendingUp} title="Total Revenue" value={`EGP ${(total/1000000).toFixed(2)}M`} trend="up" change="+8.5%" delay={0} />
            <StatCard icon={TrendingUp} title="Rental Income" value={`EGP ${(rental/1000000).toFixed(2)}M`} delay={1} />
            <StatCard icon={TrendingUp} title="Services" value={`EGP ${(services/1000).toFixed(0)}K`} delay={2} />
            <StatCard icon={TrendingUp} title="Collection Rate" value={`${total > 0 ? ((received/total)*100).toFixed(1) : 0}%`} delay={3} />
          </div>
          <DataTable title="Revenue Records" columns={[
            { key: 'property', label: 'Property' }, { key: 'type', label: 'Type' },
            { key: 'amount', label: 'Amount' }, { key: 'date', label: 'Date' }, { key: 'status', label: 'Status' },
          ]} data={revenue.map(r => ({
            property: r.properties?.name || '—', type: r.type,
            amount: `EGP ${Number(r.amount).toLocaleString()}`, date: r.date, status: r.status,
          }))} />
        </>
      )}
    </div>
  )
}
