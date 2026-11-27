import { useEffect, useState } from 'react'
import { AuthContext } from './authContext'

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../api/auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionError, setSessionError] = useState('')

  useEffect(() => {
    let active = true

    async function restoreSession() {
      try {
        const response = await getCurrentUser()

        if (active) {
          setUser(response.user)
        }
      } catch (error) {
        if (active) {
          setUser(null)

          if (error.status !== 401) {
            setSessionError(
              'Unable to verify your session. Please refresh the page.',
            )
          }
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      active = false
    }
  }, [])

  async function login(credentials) {
    const response = await loginUser(credentials)

    setUser(response.user)
    setSessionError('')

    return response.user
  }

  async function register(values) {
    return registerUser(values)
  }

  async function logout() {
    try {
      await logoutUser()
    } catch (error) {
      if (error.status !== 401) {
        throw error
      }
    }

    setUser(null)
    setSessionError('')
  }

  const value = {
    user,
    loading,
    sessionError,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}