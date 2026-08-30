import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://hackathon-project-sepia-iota.vercel.app/api',
  withCredentials: true,
})

// Attach the auth token to every outgoing request, if we have one.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Handle expired/invalid sessions globally: clear local auth state and
// bounce to /login, unless we're already there (avoids redirect loops).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (path !== '/login' && path !== '/signup') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
