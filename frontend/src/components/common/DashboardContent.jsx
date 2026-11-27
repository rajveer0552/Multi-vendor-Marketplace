import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import Loader from './Loader'
import ErrorAlert from './ErrorAlert'

export default function DashboardContent({
  title,
  description,
  loadDashboard,
  features,
}) {
  const { user } = useAuth()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function fetchDashboard() {
      try {
        const response = await loadDashboard()

        if (active) {
          setData(response)
        }
      } catch (error) {
        if (active) {
          setError(error.message)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchDashboard()

    return () => {
      active = false
    }
  }, [loadDashboard])

  if (loading) {
    return <Loader message="Loading dashboard..." />
  }

  if (error) {
    return <ErrorAlert message={error} />
  }

  return (
    <div className="container py-5">
      <div className="dashboard-banner mb-4">
        <h1>{title}</h1>

        <p className="mb-1">
          Welcome, {user.first_name} {user.last_name}
        </p>

        <p className="mb-0">
          {description}
        </p>
      </div>

      <div className="alert alert-success">
        {data?.message} — API connected successfully.
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5>Account Information</h5>

              <hr />

              <p>
                <strong>Name:</strong>{' '}
                {user.first_name} {user.last_name}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <p className="mb-0">
                <strong>Role:</strong>{' '}
                <span className="text-capitalize">
                  {data?.role}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5>Account Access</h5>

              <hr />

              <p>Authentication: Successful</p>
              <p>Authorization: Verified</p>
              <p className="mb-0">
                Session: Active
              </p>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mb-3">Marketplace Features</h4>

      <div className="row g-4">
        {features.map((feature) => (
          <div
            className="col-md-6 col-lg-4"
            key={feature.title}
          >
            <div className="card feature-card h-100">
              <div className="card-body">
                <h5>{feature.title}</h5>

                <p className="text-muted">
                  {feature.description}
                </p>

                <span className="badge text-bg-secondary">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}