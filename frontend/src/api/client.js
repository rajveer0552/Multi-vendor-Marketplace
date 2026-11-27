const API_BASE_URL = '/api/v1'

export class ApiError extends Error {
  constructor(message, status, errors = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return null
}

async function getCsrfToken() {
  const response = await fetch(`${API_BASE_URL}/auth/csrf`, {
    method: 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  })

  const data = await parseResponse(response)

  if (!response.ok || !data?.csrf_token) {
    throw new ApiError(
      'Unable to obtain security token',
      response.status,
    )
  }

  return data.csrf_token
}

export async function apiRequest(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase()

  const headers = new Headers(options.headers)

  headers.set('Accept', 'application/json')

  if (options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrfToken = await getCsrfToken()

    headers.set('X-CSRF-Token', csrfToken)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method,
    headers,
    credentials: 'same-origin',
    cache: 'no-store',
  })

  const data = await parseResponse(response)

  if (!response.ok) {
    const errors = Array.isArray(data?.errors)
      ? data.errors
      : []

    throw new ApiError(
      data?.error ||
        errors.join(', ') ||
        `Request failed (${response.status})`,
      response.status,
      errors,
    )
  }

  return data
}