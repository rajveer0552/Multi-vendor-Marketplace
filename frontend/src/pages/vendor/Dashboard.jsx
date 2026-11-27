import DashboardContent from '../../components/common/DashboardContent'
import { getVendorDashboard } from '../../api/dashboard'

const features = [
  {
    title: 'Manage Products',
    description: 'Create, update and manage your products.',
  },
  {
    title: 'Inventory',
    description: 'Monitor stock and product availability.',
  },
  {
    title: 'Vendor Orders',
    description: 'Manage customer orders and fulfilment.',
  },
  {
    title: 'Sales Analytics',
    description: 'Track revenue and product performance.',
  },
  {
    title: 'Payments',
    description: 'Monitor commissions and payouts.',
  },
  {
    title: 'Store Settings',
    description: 'Manage your vendor business profile.',
  },
]

export default function VendorDashboard() {
  return (
    <DashboardContent
      title="Vendor Dashboard"
      description="Manage your products, inventory and sales."
      loadDashboard={getVendorDashboard}
      features={features}
    />
  )
}