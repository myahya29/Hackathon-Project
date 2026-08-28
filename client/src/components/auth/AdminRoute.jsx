import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import Loader from '../common/Loader'

export default function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role !== 'admin') {
      toast.error('Access denied — admin only')
    }
  }, [loading, isAuthenticated, user])

  if (loading) {
    return <Loader fullPage label="Checking your session…" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
