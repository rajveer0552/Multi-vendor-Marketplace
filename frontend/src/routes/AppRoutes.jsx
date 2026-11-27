import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Layout from '../components/layout/Layout'
import ProtectedRoute from './ProtectedRoute'

import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

import CustomerDashboard from '../pages/customer/Dashboard'
import VendorDashboard from '../pages/vendor/Dashboard'
import AdminDashboard from '../pages/admin/Dashboard'

import Forbidden from '../pages/Forbidden'
import NotFound from '../pages/NotFound'

import useAuth from '../hooks/useAuth'

import {
  ROLES,
  getDashboardRoute,
} from '../utils/constants'

function DashboardRedirect() {
  const { user } = useAuth()

  return (
    <Navigate
      to={getDashboardRoute(user.role)}
      replace
    />
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/forbidden"
          element={<Forbidden />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<DashboardRedirect />}
          />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.CUSTOMER]}
            />
          }
        >
          <Route
            path="/customer/dashboard"
            element={<CustomerDashboard />}
          />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.VENDOR]}
            />
          }
        >
          <Route
            path="/vendor/dashboard"
            element={<VendorDashboard />}
          />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN]}
            />
          }
        >
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}