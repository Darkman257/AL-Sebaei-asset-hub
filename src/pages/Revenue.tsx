import { TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { supabase } from '../lib/supabase'

export default function Revenue() {
  const [revenue, setRevenue] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('revenue').select('*, properties(name)').order('date', { ascending: false })
      .then(({ data }) => { setRevenue(data || []); setLoading(false) })
  }, [])

  const total = revenue.reduce((s, r) => s + Number(r.amount), 0)
  const rental = revenue.filter(r => r.type === 'Rental').reduce((s, r) => s + Number(r.amount), 0)
  const services = revenue.filter(r => r.type === 'Service').reduce((s, r) => s + Number(r.amount), 0)
  const received = revenue.filter(r => r.status === 'Received').reduce((s, r) => s + Number(r.amount), 0)

  const tableData = revenue.map(r => ({
    property: r.properties?.name || '—',
    type: r.type,
    amount: `SAR ${Number(r.amount).toLocaleString()}`,
    date: r.date,
    status: r.status,
  }))

  return (
    <div>
      <PageHeader title="Revenue" description="Income streams and financial performance" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={TrendingUp} title="Total Revenue" value={`SAR ${(total/1000000).toFixed(2)}M`} trend="up" change="+8.5%" />
        <StatCard icon={TrendingUp} title="Rental Income" value={`SAR ${(rental/1000000).toFixed(2)}M`} />
        <StatCard icon={TrendingUp} title="Services" value={`SAR ${(services/1000).toFixed(0)}K`} />
        <StatCard icon={TrendingUp} title="Collection Rate" value={`${total > 0 ? ((received/total)*100).toFixed(1) : 0}%`} />
      </div>
      {loading ? <p className="text-white/40">Loading...</p> : (
        <DataTable title="Revenue Records" columns={[
          { key: 'property', label: 'Property' }, { key: 'type', label: 'Type' },
          { key: 'amount', label: 'Amount' }, { key: 'date', label: 'Date' }, { key: 'status', label: 'Status' },
        ]} data={tableData} />
      )}
    </div>
  )
}
