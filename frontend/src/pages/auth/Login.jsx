import { useState } from 'react'

import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import Loader from '../../components/common/Loader'
import ErrorAlert from '../../components/common/ErrorAlert'

import { validateLogin } from '../../utils/validators'
import { getDashboardRoute } from '../../utils/constants'

export default function Login() {
  const { login, user, loading } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  const [values, setValues] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setServerError('')

    const validationErrors = validateLogin(values)

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setSubmitting(true)

    try {
      const authenticatedUser = await login({
        email: values.email.trim(),
        password: values.password,
      })

      navigate(
        getDashboardRoute(authenticatedUser.role),
        { replace: true },
      )
    } catch (error) {
      setServerError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Loader />
  }

  if (user) {
    return (
      <Navigate
        to={getDashboardRoute(user.role)}
        replace
      />
    )
  }

  return (
    <div className="container auth-container py-5">
      <div className="card auth-card shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h2 className="text-center fw-bold">
            Welcome Back
          </h2>

          <p className="text-muted text-center mb-4">
            Login to your marketplace account
          </p>

          {location.state?.message && (
            <div className="alert alert-success">
              {location.state.message}
            </div>
          )}

          <ErrorAlert message={serverError} />

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label
                htmlFor="email"
                className="form-label"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={
                  `form-control ${errors.email ? 'is-invalid' : ''}`
                }
                value={values.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={submitting}
                required
              />

              <div className="invalid-feedback">
                {errors.email}
              </div>
            </div>

            <div className="mb-3">
              <label
                htmlFor="password"
                className="form-label"
              >
                Password
              </label>

              <div className="input-group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={
                    `form-control ${errors.password ? 'is-invalid' : ''}`
                  }
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={submitting}
                  required
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-pressed={showPassword}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {errors.password && (
                <div className="text-danger small mt-1">
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-3"
              disabled={submitting}
            >
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center mt-4 mb-0">
            Don't have an account?{' '}

            <Link to="/register">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}