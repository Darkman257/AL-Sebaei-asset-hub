import { Receipt } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import { SkeletonCard, SkeletonTable } from '../components/Skeleton'
import { supabase } from '../lib/supabase'

export default function Expenses() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('expenses').select('*, properties(name)').order('date', { ascending: false })
      .then(({ data, error: e }) => { if (e) setError(e.message); else setExpenses(data || []); setLoading(false) })
  }, [])

  if (error) return <><PageHeader title="Expenses" /><ErrorState message={error} /></>

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0)
  const paid = expenses.filter(e => e.status === 'Paid').reduce((s, e) => s + Number(e.amount), 0)
  const pending = expenses.filter(e => e.status === 'Pending').reduce((s, e) => s + Number(e.amount), 0)

  return (
    <div>
      <PageHeader title="Expenses" description="Track property-related expenses" />
      {loading ? (
        <><div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div><SkeletonTable /></>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard icon={Receipt} title="Total" value={`EGP ${(total/1000).toFixed(0)}K`} delay={0} />
            <StatCard icon={Receipt} title="Paid" value={`EGP ${(paid/1000).toFixed(0)}K`} delay={1} />
            <StatCard icon={Receipt} title="Pending" value={`EGP ${(pending/1000).toFixed(0)}K`} delay={2} />
            <StatCard icon={Receipt} title="Categories" value={new Set(expenses.map(e => e.category)).size} delay={3} />
          </div>
          <DataTable title="All Expenses" columns={[
            { key: 'category', label: 'Category' }, { key: 'description', label: 'Description' },
            { key: 'property', label: 'Property' }, { key: 'amount', label: 'Amount' },
            { key: 'date', label: 'Date' }, { key: 'status', label: 'Status' },
          ]} data={expenses.map(e => ({
            category: e.category, description: e.description,
            property: e.properties?.name || 'All Properties',
            amount: `EGP ${Number(e.amount).toLocaleString()}`, date: e.date, status: e.status,
          }))} />
        </>
      )}
    </div>
  )
}
