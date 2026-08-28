import api from './axios'

export const userService = {
  list: (page = 1, limit = 10) =>
    api.get('/users', { params: { page, limit } }).then((res) => res.data),

  get: (id) => api.get(`/users/${id}`).then((res) => res.data),

  update: (id, updates) => api.put(`/users/${id}`, updates).then((res) => res.data),

  remove: (id) => api.delete(`/users/${id}`).then((res) => res.data),
}
