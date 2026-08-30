import { useState, useEffect } from 'react'
import { X, ShieldCheck, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { complaintService } from '../../api/complaintService'

export default function OfficerStatusModal({ complaint, isOpen, onClose, onSuccess }) {
  const [status, setStatus] = useState('In Progress')
  const [remark, setRemark] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status || 'In Progress')
      setRemark(complaint.officerRemark || '')
    }
  }, [complaint])

  if (!isOpen || !complaint) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await complaintService.updateStatus(complaint._id, { status, remark })
      toast.success(`Complaint status updated to ${status}`)
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Officer Action Panel</h3>
              <p className="text-xs text-slate-500">Update redressal progress & official remark</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
          <div className="font-bold text-slate-800">{complaint.title}</div>
          <div className="text-slate-500 flex items-center gap-3">
            <span>Category: {complaint.category}</span>
            <span>Area: {complaint.area}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Update Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Pending', color: 'amber', icon: Clock },
                { label: 'In Progress', color: 'blue', icon: AlertCircle },
                { label: 'Resolved', color: 'emerald', icon: CheckCircle },
              ].map((item) => {
                const isSelected = status === item.label
                return (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => setStatus(item.label)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Officer Official Remark / Update Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Maintenance crew dispatched. Expected resolution within 24h."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Officer Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
