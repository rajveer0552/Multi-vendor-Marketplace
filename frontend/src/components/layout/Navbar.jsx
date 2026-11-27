import { useState } from 'react'
import {
  Link,
  NavLink,
  useNavigate,
} from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import { getDashboardRoute } from '../../utils/constants'
import ErrorAlert from '../common/ErrorAlert'

export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  const [expanded, setExpanded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleLogout() {
    setSubmitting(true)
    setError('')

    try {
      await logout()

      setExpanded(false)
      navigate('/login', { replace: true })
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  function closeMenu() {
    setExpanded(false)
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link
            className="navbar-brand fw-bold"
            to="/"
            onClick={closeMenu}
          >
            Marketplace
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={expanded}
            aria-controls="main-navigation"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            id="main-navigation"
            className={
              `collapse navbar-collapse ${expanded ? 'show' : ''}`
            }
          >
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/"
                  end
                  onClick={closeMenu}
                >
                  Home
                </NavLink>
              </li>

              {user && (
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to={getDashboardRoute(user.role)}
                    onClick={closeMenu}
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}
            </ul>

            {!loading && (
              <div className="d-flex flex-wrap align-items-center gap-3">
                {user ? (
                  <>
                    <span className="text-light">
                      {user.first_name}

                      <span className="badge text-bg-secondary ms-2">
                        {user.role}
                      </span>
                    </span>

                    <button
                      className="btn btn-outline-light"
                      onClick={handleLogout}
                      disabled={submitting}
                    >
                      {submitting ? 'Logging out...' : 'Logout'}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="btn btn-outline-light"
                      onClick={closeMenu}
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="btn btn-primary"
                      onClick={closeMenu}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {error && (
        <div className="container mt-3">
          <ErrorAlert message={error} />
        </div>
      )}
    </>
  )
}