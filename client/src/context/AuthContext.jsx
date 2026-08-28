import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { authService } from '../api/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // On mount, if a token is stored, validate it against the backend and
  // restore the session. If it's no longer valid, clear it silently.
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) {
        setLoading(false)
        return
      }
      try {
        const res = await authService.me()
        setUser(res.data.user)
        setToken(storedToken)
      } catch (err) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password)
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setToken(res.token)
      setUser(res.data.user)
      toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}!`)
      return true
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to log in. Please try again.'
      toast.error(message)
      return false
    }
  }

  const signup = async (name, email, password) => {
    try {
      const res = await authService.signup(name, email, password)
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setToken(res.token)
      setUser(res.data.user)
      toast.success(`Welcome aboard, ${res.data.user.name.split(' ')[0]}!`)
      return true
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to create your account.'
      toast.error(message)
      return false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      // Even if the backend call fails, still clear the local session.
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
      toast.success('Logged out successfully')
      window.location.href = '/'
    }
  }

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
