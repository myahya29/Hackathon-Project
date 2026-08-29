import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { authService } from '../api/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user')
      return savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token')
    return savedToken && savedToken !== 'undefined' ? savedToken : null
  })
  const [loading, setLoading] = useState(true)

  // On mount, if a token is stored, validate it against the backend and
  // restore the session. If it's no longer valid, clear it silently.
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('token')
      if (!storedToken || storedToken === 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
        setLoading(false)
        return
      }
      try {
        const res = await authService.me()
        const fetchedUser = res.data?.user || res.user
        setUser(fetchedUser)
        setToken(storedToken)
        localStorage.setItem('user', JSON.stringify(fetchedUser))
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
      const userObj = res.data?.user || res.user
      const authToken = res.data?.token || res.token
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(userObj))
      setToken(authToken)
      setUser(userObj)
      toast.success(`Welcome back, ${userObj.name.split(' ')[0]}!`)
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
      const userObj = res.data?.user || res.user
      const authToken = res.data?.token || res.token
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(userObj))
      setToken(authToken)
      setUser(userObj)
      toast.success(`Welcome aboard, ${userObj.name.split(' ')[0]}!`)
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
