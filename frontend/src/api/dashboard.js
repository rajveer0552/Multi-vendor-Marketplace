import { apiRequest } from './client'

export function getCustomerDashboard() {
  return apiRequest('/dashboard/customer')
}

export function getVendorDashboard() {
  return apiRequest('/dashboard/vendor')
}

export function getAdminDashboard() {
  return apiRequest('/dashboard/admin')
}