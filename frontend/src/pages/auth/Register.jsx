import { useState } from 'react'

import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import Loader from '../../components/common/Loader'
import ErrorAlert from '../../components/common/ErrorAlert'

import { validateRegistration } from '../../utils/validators'
import { getDashboardRoute } from '../../utils/constants'

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: '',
}

const fields = [
  {
    name: 'first_name',
    label: 'First Name',
    type: 'text',
    autoComplete: 'given-name',
  },
  {
    name: 'last_name',
    label: 'Last Name',
    type: 'text',
    autoComplete: 'family-name',
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    autoComplete: 'email',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    autoComplete: 'new-password',
  },
  {
    name: 'password_confirmation',
    label: 'Confirm Password',
    type: 'password',
    autoComplete: 'new-password',
  },
]

export default function Register() {
  const { register, user, loading } = useAuth()
  const navigate = useNavigate()

  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

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

    const validationErrors = validateRegistration(values)

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setSubmitting(true)

    try {
      await register({
        ...values,
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        email: values.email.trim(),
      })

      navigate('/login', {
        replace: true,
        state: {
          message: 'Registration successful. Please login.',
        },
      })
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
            Create Account
          </h2>

          <p className="text-muted text-center mb-4">
            Join our multi-vendor marketplace
          </p>

          <ErrorAlert message={serverError} />

          <form onSubmit={handleSubmit} noValidate>
            {fields.map((field) => (
              <div className="mb-3" key={field.name}>
                <label
                  htmlFor={field.name}
                  className="form-label"
                >
                  {field.label}
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  className={
                    `form-control ${
                      errors[field.name] ? 'is-invalid' : ''
                    }`
                  }
                  value={values[field.name]}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                />

                <div className="invalid-feedback">
                  {errors[field.name]}
                </div>
              </div>
            ))}

            <p className="small text-muted">
              All new accounts are registered as customers.
            </p>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-2"
              disabled={submitting}
            >
              {submitting
                ? 'Creating account...'
                : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-4 mb-0">
            Already have an account?{' '}

            <Link to="/login">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}