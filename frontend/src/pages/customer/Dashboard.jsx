import DashboardContent from '../../components/common/DashboardContent'
import { getCustomerDashboard } from '../../api/dashboard'

const features = [
  {
    title: 'Browse Products',
    description: 'Explore products from multiple vendors.',
  },
  {
    title: 'Shopping Cart',
    description: 'Manage products before checkout.',
  },
  {
    title: 'My Orders',
    description: 'View orders and track deliveries.',
  },
  {
    title: 'Wishlist',
    description: 'Save your favourite products.',
  },
  {
    title: 'Reviews',
    description: 'Review your purchased products.',
  },
  {
    title: 'Account Settings',
    description: 'Manage your personal information.',
  },
]

export default function CustomerDashboard() {
  return (
    <DashboardContent
      title="Customer Dashboard"
      description="Manage your shopping experience."
      loadDashboard={getCustomerDashboard}
      features={features}
    />
  )
}