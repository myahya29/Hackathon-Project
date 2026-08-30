import { useState } from 'react'
import { SearchCheck, ThumbsUp, MapPin, Tag, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { complaintService } from '../../api/complaintService'

export default function DuplicateCheckView({ onUpvote }) {
  const [category, setCategory] = useState('Road')
  const [area, setArea] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!area.trim()) {
      toast.error('Please enter an area name')
      return
    }

    setLoading(true)
    setSearched(true)
    try {
      const res = await complaintService.checkDuplicate(category, area.trim())
      setResults(res.data?.complaints || [])
    } catch (err) {
      toast.error('Failed to query duplicate complaints')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER CARD */}
      <div className="sq-card p-6 bg-slate-900 text-white border-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <SearchCheck size={22} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Duplicate Complaint Checker</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Check if an active complaint for your area already exists. Upvoting an existing issue increases its priority score!
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row items-stretch gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2.5 rounded-xl text-slate-900 bg-white border border-slate-200 text-xs font-semibold focus:outline-none"
          >
            <option value="Road">Road & Potholes</option>
            <option value="Garbage">Garbage & Sanitation</option>
            <option value="Water">Water Supply</option>
            <option value="Electricity">Electricity & Streetlights</option>
            <option value="Other">Other Issues</option>
          </select>

          <input
            type="text"
            placeholder="Enter Area / Locality (e.g. Sector 4)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2.5 rounded-xl text-slate-900 bg-white border border-slate-200 text-xs font-medium focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-1/3 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Check Locality Complaints'}
          </button>
        </form>
      </div>

      {/* RESULTS LIST */}
      {searched && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Active Complaints in "{area}" ({results.length})
          </h3>

          {results.length === 0 ? (
            <div className="sq-card text-center py-10 text-slate-500">
              <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2" />
              <p className="font-semibold text-slate-700 text-sm">No active complaints found in this area!</p>
              <p className="text-xs text-slate-400 mt-1">You can safely submit a new complaint.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((c) => (
                <div key={c._id} className="sq-card space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold shrink-0">
                      {c.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Tag size={14} className="text-slate-400" />
                        {c.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-slate-400" />
                        {c.area}
                      </span>
                    </div>

                    <button
                      onClick={() => onUpvote?.(c._id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <ThumbsUp size={14} />
                      <span>{c.upvotes} Upvote</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
