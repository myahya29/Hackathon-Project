import { useState } from 'react'
import { X, Star, MessageSquareText, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { complaintService } from '../../api/complaintService'

export default function FeedbackModal({ complaint, isOpen, onClose, onSuccess }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen || !complaint) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await complaintService.submitFeedback(complaint._id, { rating, comment })
      toast.success('Thank you for rating our redressal speed & quality!')
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <MessageSquareText size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Citizen Satisfaction Feedback</h3>
              <p className="text-xs text-slate-500">Rate the redressal work for resolved complaint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="font-bold text-slate-800">{complaint.title}</div>
          <div className="text-slate-500 mt-0.5">Area: {complaint.area} | Category: {complaint.category}</div>
          {complaint.officerRemark && (
            <div className="mt-2 pt-2 border-t border-slate-200 text-slate-700">
              <strong className="text-slate-900">Officer Remark:</strong> {complaint.officerRemark}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 text-center">
              Satisfaction Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={
                      star <= rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200 hover:text-amber-200'
                    }
                  />
                </button>
              ))}
            </div>
            <div className="text-center text-xs font-semibold text-slate-600 mt-1">
              {rating === 5
                ? 'Excellent / Very Satisfied'
                : rating === 4
                ? 'Good'
                : rating === 3
                ? 'Average'
                : rating === 2
                ? 'Poor'
                : 'Very Dissatisfied'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Additional Feedback / Comments
            </label>
            <textarea
              rows={3}
              placeholder="Tell us what went well or how officers can improve..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm"
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
