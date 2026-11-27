import { apiRequest } from './client'

export function registerUser(user) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ user }),
  })
}

export function loginUser(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      user: credentials,
    }),
  })
}

export function logoutUser() {
  return apiRequest('/auth/logout', {
    method: 'DELETE',
  })
}

export function getCurrentUser() {
  return apiRequest('/auth/me')
}