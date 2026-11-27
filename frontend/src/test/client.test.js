import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { apiRequest } from '../api/client'

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('apiRequest', () => {
  it('returns JSON from a successful GET request', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ status: 'ok' }),
    )

    vi.stubGlobal('fetch', fetchMock)

    const response = await apiRequest('/health')

    expect(response).toEqual({ status: 'ok' })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/health',
      expect.objectContaining({
        method: 'GET',
        credentials: 'same-origin',
      }),
    )
  })

  it('obtains a CSRF token before a POST request', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(
        jsonResponse({ csrf_token: 'test-token' }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ message: 'Login successful' }),
      )

    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        user: {
          email: 'customer@example.com',
          password: 'Test@123456',
        },
      }),
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)

    const requestOptions = fetchMock.mock.calls[1][1]

    expect(
      requestOptions.headers.get('X-CSRF-Token'),
    ).toBe('test-token')
  })

  it('returns an error for unauthorized requests', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(
          { error: 'Authentication required' },
          401,
        ),
      ),
    )

    await expect(
      apiRequest('/auth/me'),
    ).rejects.toMatchObject({
      status: 401,
      message: 'Authentication required',
    })
  })

  it('returns an error for forbidden requests', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(
          { error: 'Access denied' },
          403,
        ),
      ),
    )

    await expect(
      apiRequest('/dashboard/admin'),
    ).rejects.toMatchObject({
      status: 403,
      message: 'Access denied',
    })
  })

  it('does not send a POST when CSRF retrieval fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({}, 500),
    )

    vi.stubGlobal('fetch', fetchMock)

    await expect(
      apiRequest('/auth/login', {
        method: 'POST',
      }),
    ).rejects.toMatchObject({
      message: 'Unable to obtain security token',
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})