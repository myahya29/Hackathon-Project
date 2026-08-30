import { useState, useEffect } from 'react'
import { X, AlertTriangle, Send, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { complaintService } from '../../api/complaintService'

export default function CreateComplaintModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Road',
    area: '',
    imageUrl: '',
  })

  const [duplicates, setDuplicates] = useState([])
  const [checkingDuplicates, setCheckingDuplicates] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!formData.category || !formData.area || formData.area.trim().length < 3) {
      setDuplicates([])
      return
    }

    const timer = setTimeout(async () => {
      setCheckingDuplicates(true)
      try {
        const res = await complaintService.checkDuplicate(formData.category, formData.area.trim())
        setDuplicates(res.data?.complaints || [])
      } catch (err) {
        console.error('Duplicate check error:', err)
      } finally {
        setCheckingDuplicates(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [formData.category, formData.area])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.area) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      await complaintService.createComplaint(formData)
      toast.success('Complaint filed successfully!')
      setFormData({
        title: '',
        description: '',
        category: 'Road',
        area: '',
        imageUrl: '',
      })
      setDuplicates([])
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to file complaint')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-lg border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-dark text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">File a New Grievance</h3>
              <p className="text-xs text-slate-400">Submit complaint to local municipal officers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Grievance Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Broken Water Pipeline near Main Intersection"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              >
                <option value="Road">Roads & Infrastructure</option>
                <option value="Garbage">Garbage & Sanitation</option>
                <option value="Water">Water Supply</option>
                <option value="Electricity">Electricity & Power Grid</option>
                <option value="Other">Other Issues</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Area / Locality <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Quetta Campus / Sector 4"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* DUPLICATE WARNING */}
          {checkingDuplicates && (
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Scanning active complaints in {formData.area}...
            </div>
          )}

          {duplicates.length > 0 && !checkingDuplicates && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertTriangle size={15} className="text-amber-600 shrink-0" />
                <span>Existing Locality Complaints ({duplicates.length})</span>
              </div>
              <p className="text-xs text-amber-700">
                Active complaints already exist for <strong>{formData.category}</strong> in <strong>{formData.area}</strong>:
              </p>
              <ul className="space-y-1 pl-2 border-l-2 border-amber-300">
                {duplicates.slice(0, 3).map((d) => (
                  <li key={d._id} className="flex justify-between items-center text-xs">
                    <span className="font-semibold truncate max-w-[240px]">{d.title}</span>
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">{d.upvotes} upvotes</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Image URL <span className="text-slate-400 font-normal">(Optional reference)</span>
            </label>
            <input
              type="text"
              placeholder="https://example.com/photo.jpg"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Send size={13} />
              <span>{submitting ? 'Submitting...' : 'File Grievance'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
