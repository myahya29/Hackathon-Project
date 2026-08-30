import api from './axios'

export const complaintService = {
  // Fetch all complaints with optional query filters (search, category, status, area)
  getComplaints: async (params = {}) => {
    const res = await api.get('/complaints', { params })
    return res.data
  },

  // Create a new complaint (Citizen)
  createComplaint: async (complaintData) => {
    const res = await api.post('/complaints', complaintData)
    return res.data
  },

  // Get current logged in user's complaints (Citizen)
  getMyComplaints: async () => {
    const res = await api.get('/complaints/mine')
    return res.data
  },

  // Get single complaint by ID
  getComplaintById: async (id) => {
    const res = await api.get(`/complaints/${id}`)
    return res.data
  },

  // Check duplicate complaints by category & area
  checkDuplicate: async (category, area) => {
    const res = await api.get('/complaints/check-duplicate', {
      params: { category, area },
    })
    return res.data
  },

  // Upvote a complaint (Citizen)
  upvoteComplaint: async (id) => {
    const res = await api.patch(`/complaints/${id}/upvote`)
    return res.data
  },

  // Update complaint status & officer remark (Officer)
  updateStatus: async (id, { status, remark }) => {
    const res = await api.patch(`/complaints/${id}/status`, { status, remark })
    return res.data
  },

  // Submit feedback on resolved complaint (Citizen)
  submitFeedback: async (id, { rating, comment }) => {
    const res = await api.patch(`/complaints/${id}/feedback`, { rating, comment })
    return res.data
  },

  // Get AI Daily Briefing for Officers (Officer)
  getOfficerAISummary: async () => {
    const res = await api.post('/ai/officer-summary')
    return res.data
  },

  // Export complaints as CSV file download (Officer)
  exportCSV: async (params = {}) => {
    const response = await api.get('/complaints/export', {
      params,
      responseType: 'blob',
    })
    
    // Create download link for the CSV blob
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    const today = new Date().toISOString().split('T')[0]
    link.setAttribute('download', `complaints_export_${today}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
}
