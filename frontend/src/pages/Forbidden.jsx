import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getDashboardRoute } from '../utils/constants'

export default function Forbidden() {
  const { user } = useAuth()

  return (
    <div className="container text-center py-5">
      <h1 className="display-1 fw-bold text-danger">
        403
      </h1>

      <h2>Access Denied</h2>

      <p className="text-muted">
        You do not have permission to access this page.
      </p>

      <Link
        to={user ? getDashboardRoute(user.role) : '/login'}
        className="btn btn-primary"
      >
        {user ? 'Back to Dashboard' : 'Login'}
      </Link>
    </div>
  )
}