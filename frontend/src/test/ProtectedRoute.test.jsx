import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import {
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom'

import { AuthContext } from '../context/authContext'
import ProtectedRoute from '../routes/ProtectedRoute'

function renderProtectedRoute(authState) {
  return render(
    <AuthContext.Provider
      value={{
        user: null,
        loading: false,
        sessionError: '',
        ...authState,
      }}
    >
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route
            path="/login"
            element={<h1>Login Page</h1>}
          />

          <Route
            path="/forbidden"
            element={<h1>Access Denied</h1>}
          />

          <Route
            element={
              <ProtectedRoute allowedRoles={['admin']} />
            }
          >
            <Route
              path="/admin/dashboard"
              element={<h1>Admin Dashboard</h1>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('ProtectedRoute', () => {
  it('redirects guests to login', () => {
    renderProtectedRoute({ user: null })

    expect(
      screen.getByText('Login Page'),
    ).toBeInTheDocument()
  })

  it('denies customer access to admin pages', () => {
    renderProtectedRoute({
      user: { role: 'customer' },
    })

    expect(
      screen.getByText('Access Denied'),
    ).toBeInTheDocument()
  })

  it('denies vendor access to admin pages', () => {
    renderProtectedRoute({
      user: { role: 'vendor' },
    })

    expect(
      screen.getByText('Access Denied'),
    ).toBeInTheDocument()
  })

  it('allows admin access to admin pages', () => {
    renderProtectedRoute({
      user: { role: 'admin' },
    })

    expect(
      screen.getByText('Admin Dashboard'),
    ).toBeInTheDocument()
  })

  it('shows a loader while checking the session', () => {
    renderProtectedRoute({
      loading: true,
    })

    expect(
      screen.getByRole('status'),
    ).toBeInTheDocument()
  })

  it('displays a session verification error', () => {
    renderProtectedRoute({
      sessionError: 'Unable to verify session',
    })

    expect(
      screen.getByRole('alert'),
    ).toHaveTextContent('Unable to verify session')
  })
})