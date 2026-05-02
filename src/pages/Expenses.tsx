import { Receipt } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { supabase } from '../lib/supabase'

export default function Expenses() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('expenses').select('*, properties(name)').order('date', { ascending: false })
      .then(({ data }) => { setExpenses(data || []); setLoading(false) })
  }, [])

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0)
  const paid = expenses.filter(e => e.status === 'Paid').reduce((s, e) => s + Number(e.amount), 0)
  const pending = expenses.filter(e => e.status === 'Pending').reduce((s, e) => s + Number(e.amount), 0)

  const tableData = expenses.map(e => ({
    category: e.category,
    description: e.description,
    property: e.properties?.name || 'All Properties',
    amount: `SAR ${Number(e.amount).toLocaleString()}`,
    date: e.date,
    status: e.status,
  }))

  return (
    <div>
      <PageHeader title="Expenses" description="Track property-related expenses" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Receipt} title="Total" value={`SAR ${(total/1000).toFixed(0)}K`} />
        <StatCard icon={Receipt} title="Paid" value={`SAR ${(paid/1000).toFixed(0)}K`} />
        <StatCard icon={Receipt} title="Pending" value={`SAR ${(pending/1000).toFixed(0)}K`} />
        <StatCard icon={Receipt} title="Categories" value={new Set(expenses.map(e => e.category)).size} />
      </div>
      {loading ? <p className="text-white/40">Loading...</p> : (
        <DataTable title="All Expenses" columns={[
          { key: 'category', label: 'Category' }, { key: 'description', label: 'Description' },
          { key: 'property', label: 'Property' }, { key: 'amount', label: 'Amount' },
          { key: 'date', label: 'Date' }, { key: 'status', label: 'Status' },
        ]} data={tableData} />
      )}
    </div>
  )
}
