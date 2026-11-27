export const ROLES = Object.freeze({
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  ADMIN: 'admin',
})

export const DASHBOARD_ROUTES = Object.freeze({
  [ROLES.CUSTOMER]: '/customer/dashboard',
  [ROLES.VENDOR]: '/vendor/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
})

export function getDashboardRoute(role) {
  return DASHBOARD_ROUTES[role] || '/forbidden'
}