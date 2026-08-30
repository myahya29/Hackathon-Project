import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Plus,
  Filter,
  ThumbsUp,
  ShieldCheck,
  Star,
  Download,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Tag,
  MapPin,
  Sparkles,
  Bot,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { complaintService } from '../api/complaintService'
import PortalLayout from '../components/layout/PortalLayout'
import CreateComplaintModal from '../components/complaints/CreateComplaintModal'
import OfficerStatusModal from '../components/complaints/OfficerStatusModal'
import FeedbackModal from '../components/complaints/FeedbackModal'
import DuplicateCheckView from '../components/complaints/DuplicateCheckView'

export default function Dashboard() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = searchParams.get('tab') || 'all'

  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  // AI Briefing State
  const [aiSummary, setAiSummary] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  // Search & Filter States
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [area, setArea] = useState('')

  // Modals State
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedOfficerComplaint, setSelectedOfficerComplaint] = useState(null)
  const [selectedFeedbackComplaint, setSelectedFeedbackComplaint] = useState(null)

  const isOfficer = user?.role === 'officer'

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      if (activeTab === 'mine') {
        const res = await complaintService.getMyComplaints()
        setComplaints(res.data?.complaints || [])
      } else {
        const filters = {}
        if (search) filters.search = search
        if (category) filters.category = category
        if (status) filters.status = status
        if (area) filters.area = area

        const res = await complaintService.getComplaints(filters)
        setComplaints(res.data?.complaints || [])
      }
    } catch (err) {
      toast.error('Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  const fetchAIBriefing = async () => {
    if (!isOfficer) return
    setAiLoading(true)
    try {
      const res = await complaintService.getOfficerAISummary()
      setAiSummary(res.data?.summary || '')
    } catch (err) {
      console.error('Failed to fetch AI briefing:', err)
    } finally {
      setAiLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab !== 'duplicate') {
      fetchComplaints()
    }
    if (isOfficer) {
      fetchAIBriefing()
    }
  }, [activeTab, search, category, status, area, isOfficer])

  const handleTabChange = (newTab) => {
    setSearchParams({ tab: newTab })
  }

  const handleUpvote = async (id) => {
    try {
      const res = await complaintService.upvoteComplaint(id)
      toast.success('Upvoted successfully!')
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? res.data?.complaint || c : c))
      )
    } catch (err) {
      toast.error('Failed to upvote')
    }
  }

  const handleExportCSV = async () => {
    try {
      toast.loading('Downloading CSV report...', { id: 'csv' })
      await complaintService.exportCSV({ search, category, status, area })
      toast.success('CSV Downloaded!', { id: 'csv' })
    } catch (err) {
      toast.error('Export failed', { id: 'csv' })
    }
  }

  // Real Computed Metrics
  const totalCount = complaints.length
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length
  const totalUpvotes = complaints.reduce((acc, c) => acc + (c.upvotes || 0), 0)

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Medium':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  const getStatusBadge = (statusVal) => {
    switch (statusVal) {
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }

  return (
    <PortalLayout
      activeTab={activeTab}
      setActiveTab={handleTabChange}
      onOpenNewComplaint={() => setIsCreateOpen(true)}
      onExportCSV={handleExportCSV}
      searchQuery={search}
      setSearchQuery={setSearch}
    >
      <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto">
        {/* OFFICER AI DAILY BRIEFING CARD */}
        {isOfficer && (
          <div className="sq-card p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shrink-0 mt-0.5 sm:mt-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs sm:text-sm font-extrabold tracking-wide uppercase text-emerald-400">
                      AI Daily Operations Briefing
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      Live Gemini Analysis
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1.5 leading-relaxed font-medium">
                    {aiLoading ? 'Generating AI briefing summary...' : aiSummary || 'Loading officer situational briefing...'}
                  </p>
                </div>
              </div>

              <button
                onClick={fetchAIBriefing}
                disabled={aiLoading}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition shrink-0 self-end sm:self-auto border border-white/10"
              >
                <RefreshCw size={13} className={aiLoading ? 'animate-spin' : ''} />
                <span>Refresh AI Briefing</span>
              </button>
            </div>
          </div>
        )}

        {/* METRIC SUMMARY CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="sq-card flex items-center justify-between p-3.5 sm:p-4">
            <div>
              <div className="text-xl font-bold text-slate-900">{totalCount}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Total Complaints Filed</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
              <FileText size={16} />
            </div>
          </div>

          <div className="sq-card flex items-center justify-between p-3.5 sm:p-4">
            <div>
              <div className="text-xl font-bold text-emerald-600">{resolvedCount}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Resolved Complaints</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 size={16} />
            </div>
          </div>

          <div className="sq-card flex items-center justify-between p-3.5 sm:p-4">
            <div>
              <div className="text-xl font-bold text-amber-600">{pendingCount}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Pending Officer Action</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
              <Clock size={16} />
            </div>
          </div>

          <div className="sq-card flex items-center justify-between p-3.5 sm:p-4">
            <div>
              <div className="text-xl font-bold text-blue-600">{totalUpvotes}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Community Upvotes</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
              <ThumbsUp size={16} />
            </div>
          </div>
        </div>

        {/* TAB CONTROLS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap max-w-full pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Complaints' },
              { id: 'mine', label: 'My Complaints' },
              { id: 'duplicate', label: 'Duplicate Checker' },
              ...(isOfficer ? [{ id: 'officer', label: 'Officer Operations' }] : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchComplaints}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1 text-xs font-semibold shrink-0"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* MAIN VIEW */}
        {activeTab === 'duplicate' ? (
          <DuplicateCheckView onUpvote={handleUpvote} />
        ) : (
          <div className="space-y-3.5">
            {/* FILTERS BAR */}
            <div className="sq-card p-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="">Filter by Category: All</option>
                <option value="Road">Road & Potholes</option>
                <option value="Garbage">Garbage & Sanitation</option>
                <option value="Water">Water Supply</option>
                <option value="Electricity">Electricity & Streetlights</option>
                <option value="Other">Other Issues</option>
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="">Filter by Status: All</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <input
                type="text"
                placeholder="Filter by Locality / Area..."
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* COMPLAINTS TABLE */}
            <div className="sq-card p-0 overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[600px] text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-3.5">Title & Details</th>
                      <th className="py-2.5 px-3.5">Category</th>
                      <th className="py-2.5 px-3.5">Area</th>
                      <th className="py-2.5 px-3.5">Status</th>
                      <th className="py-2.5 px-3.5">Priority</th>
                      <th className="py-2.5 px-3.5 text-center">Upvotes</th>
                      <th className="py-2.5 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                          Loading complaints...
                        </td>
                      </tr>
                    ) : complaints.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                          No complaints found.
                        </td>
                      </tr>
                    ) : (
                      complaints.map((c) => (
                        <tr key={c._id} className="hover:bg-slate-50/70 transition">
                          <td className="py-2.5 px-3.5 max-w-xs">
                            <div className="font-bold text-slate-900 text-xs">{c.title}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {c.description}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Filed by: {c.createdBy?.name || 'Citizen'}
                            </div>
                          </td>

                          <td className="py-2.5 px-3.5 text-xs font-semibold">
                            <span className="inline-flex items-center gap-1">
                              <Tag size={13} className="text-slate-400" />
                              {c.category}
                            </span>
                          </td>

                          <td className="py-2.5 px-3.5 text-xs font-semibold">
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={13} className="text-slate-400" />
                              {c.area}
                            </span>
                          </td>

                          <td className="py-2.5 px-3.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                                c.status
                              )}`}
                            >
                              {c.status}
                            </span>
                          </td>

                          <td className="py-2.5 px-3.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${getPriorityBadge(
                                c.priority
                              )}`}
                            >
                              {c.priority || 'Low'}
                            </span>
                          </td>

                          <td className="py-2.5 px-3.5 text-center font-bold text-slate-900 text-xs">
                            {c.upvotes || 0}
                          </td>

                          <td className="py-2.5 px-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              <button
                                onClick={() => handleUpvote(c._id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition inline-flex items-center gap-1"
                                title="Upvote complaint"
                              >
                                <ThumbsUp size={13} />
                                <span>Upvote</span>
                              </button>

                              {isOfficer && (
                                <button
                                  onClick={() => setSelectedOfficerComplaint(c)}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition inline-flex items-center gap-1"
                                  title="Update Status"
                                >
                                  <ShieldCheck size={13} />
                                  <span>Status</span>
                                </button>
                              )}

                              {c.status === 'Resolved' && (
                                <button
                                  onClick={() => setSelectedFeedbackComplaint(c)}
                                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition inline-flex items-center gap-1"
                                  title="Give Feedback"
                                >
                                  <Star size={13} />
                                  <span>Feedback</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <CreateComplaintModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchComplaints}
      />

      <OfficerStatusModal
        complaint={selectedOfficerComplaint}
        isOpen={!!selectedOfficerComplaint}
        onClose={() => setSelectedOfficerComplaint(null)}
        onSuccess={fetchComplaints}
      />

      <FeedbackModal
        complaint={selectedFeedbackComplaint}
        isOpen={!!selectedFeedbackComplaint}
        onClose={() => setSelectedFeedbackComplaint(null)}
        onSuccess={fetchComplaints}
      />
    </PortalLayout>
  )
}
