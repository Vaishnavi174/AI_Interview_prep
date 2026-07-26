import React, { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getMe()
        .then((fullUser) => {
          setUser((prev) => ({ ...prev, ...fullUser }))
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (authResponse) => {
    localStorage.setItem('token', authResponse.token)
    const userData = {
      id: authResponse.userId,
      fullName: authResponse.fullName,
      email: authResponse.email,
      onboardingComplete: authResponse.onboardingComplete,
    }
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const updateUser = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch }
      localStorage.setItem('user', JSON.stringify(next))
      return next
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
