import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Sparkles, MessageSquareText, SearchCheck, ThumbsUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between font-sans">
      {/* HERO SECTION */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center sm:px-6">
        <div className="mb-4 flex flex-col items-center">
          <img src="/logo.png" alt="Citizen Complaint Portal Logo" className="h-24 w-24 sm:h-28 sm:w-28 object-contain mb-3 drop-shadow-lg" />
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1 text-xs font-extrabold text-emerald-800 uppercase tracking-wide">
            Official Municipal Grievance Portal
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
          Citizen Complaint Portal
        </h1>

        <p className="mt-4 max-w-xl text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          File municipal complaints across Roads, Sanitation, Water Supply, and Power Grid. Track real-time resolution status, upvote community issues, and provide direct feedback to local officers.
        </p>

        {/* CTA BUTTONS */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white transition"
            >
              Open Redressal Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white transition"
              >
                Register Citizen Account <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {isAuthenticated && (
          <p className="mt-3 text-xs text-slate-500 font-semibold">
            Logged in as <span className="text-slate-900 font-bold">{user?.name}</span> ({user?.role === 'officer' ? 'Officer' : 'Citizen'})
          </p>
        )}
      </section>

      {/* FEATURE CARDS */}
      <section className="mx-auto grid max-w-4xl gap-4 px-4 pb-16 sm:grid-cols-3 sm:px-6">
        {[
          {
            icon: SearchCheck,
            title: 'Real-time Duplicate Prevention',
            text: 'Scans active complaints in real-time when filing to prevent duplicate submissions.',
          },
          {
            icon: ThumbsUp,
            title: 'Community Priority Upvoting',
            text: 'Community upvotes dynamically elevate issue priority score for faster dispatch.',
          },
          {
            icon: MessageSquareText,
            title: 'Officer Remarks & Ratings',
            text: 'Track official remarks, resolution status, and submit satisfaction feedback.',
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="sq-card p-4 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-dark text-emerald-400 font-bold">
              <Icon size={16} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
