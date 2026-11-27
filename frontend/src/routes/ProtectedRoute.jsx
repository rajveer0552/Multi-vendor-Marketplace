import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Loader from '../components/common/Loader'
import ErrorAlert from '../components/common/ErrorAlert'

export default function ProtectedRoute({
  allowedRoles = [],
}) {
  const { user, loading, sessionError } = useAuth()

  if (loading) {
    return <Loader message="Verifying your session..." />
  }

  if (sessionError) {
    return (
      <div className="container py-5">
        <ErrorAlert message={sessionError} />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/forbidden" replace />
  }

  return <Outlet />
}