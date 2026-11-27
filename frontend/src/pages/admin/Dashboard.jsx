import DashboardContent from '../../components/common/DashboardContent'
import { getAdminDashboard } from '../../api/dashboard'

const features = [
  {
    title: 'Manage Users',
    description: 'Manage marketplace user accounts.',
  },
  {
    title: 'Vendor Approvals',
    description: 'Review and approve vendor applications.',
  },
  {
    title: 'Product Management',
    description: 'Monitor marketplace product listings.',
  },
  {
    title: 'Order Management',
    description: 'Monitor marketplace orders.',
  },
  {
    title: 'Commission Management',
    description: 'Manage marketplace commission settings.',
  },
  {
    title: 'Reports and Analytics',
    description: 'Monitor overall marketplace performance.',
  },
]

export default function AdminDashboard() {
  return (
    <DashboardContent
      title="Admin Dashboard"
      description="Manage and monitor the marketplace."
      loadDashboard={getAdminDashboard}
      features={features}
    />
  )
}