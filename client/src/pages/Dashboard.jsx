import { Link } from 'react-router-dom'
import { Package, TrendingUp, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import EmptyState from '../components/common/EmptyState'
import Badge from '../components/common/Badge'
import toast from 'react-hot-toast'

const today = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="animate-fadeIn mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name} 👋</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{today}</p>
      </header>

      {/*
        PLACEHOLDER — TODO: wire these stat cards to real feature data
        once the actual hackathon task/feature set is defined. Right now
        these are static zero-state values just to establish the layout.
      */}
      <section className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 border-t-[3px] border-t-indigo-600 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:border-t-indigo-500 dark:bg-slate-900">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Package size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">Total Items</p>
        </div>
        <div className="rounded-2xl border border-gray-100 border-t-[3px] border-t-violet-600 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:border-t-violet-500 dark:bg-slate-900">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
            <TrendingUp size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">This Week</p>
        </div>
        <div className="rounded-2xl border border-gray-100 border-t-[3px] border-t-emerald-600 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:border-t-emerald-500 dark:bg-slate-900">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <ShieldCheck size={20} />
          </div>
          <Badge color="emerald">Active</Badge>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Account Status</p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        {/* TODO: replace with real activity feed once a feature is defined */}
        <EmptyState
          icon={Package}
          title="No activity yet"
          message="Once you start using the product, your recent activity will show up here."
          actionLabel="+ Create New"
          onAction={() => toast('This is a placeholder — wire it up once your feature is defined.')}
        />
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/profile"
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <User size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">View Profile</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">See and update your account details</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
