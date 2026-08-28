import api from './axios'

export const authService = {
  signup: (name, email, password) =>
    api.post('/auth/signup', { name, email, password }).then((res) => res.data),

  login: (email, password) =>
    api.post('/auth/login', { email, password }).then((res) => res.data),

  me: () => api.get('/auth/me').then((res) => res.data),

  logout: () => api.post('/auth/logout').then((res) => res.data),
}
