import { Receipt } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { expenses } from '../lib/data'

export default function Expenses() {
  return (
    <div>
      <PageHeader title="Expenses" description="Track property-related expenses and costs" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Receipt} title="Total (Month)" value="SAR 182.5K" trend="down" change="-5%" />
        <StatCard icon={Receipt} title="Pending" value="SAR 77K" />
        <StatCard icon={Receipt} title="Paid" value="SAR 105.5K" />
        <StatCard icon={Receipt} title="Budget Remaining" value="SAR 67.5K" />
      </div>

      <DataTable
        title="Recent Expenses"
        columns={[
          { key: 'category', label: 'Category' },
          { key: 'description', label: 'Description' },
          { key: 'property', label: 'Property' },
          { key: 'amount', label: 'Amount' },
          { key: 'date', label: 'Date' },
          { key: 'status', label: 'Status' },
        ]}
        data={expenses}
      />
    </div>
  )
}
