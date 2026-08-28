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
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name} 👋</h1>
        <p className="mt-1 text-sm text-gray-500">{today}</p>
      </header>

      {/*
        PLACEHOLDER — TODO: wire these stat cards to real feature data
        once the actual hackathon task/feature set is defined. Right now
        these are static zero-state values just to establish the layout.
      */}
      <section className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Package size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500">Total Items</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <TrendingUp size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500">This Week</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck size={20} />
          </div>
          <Badge color="emerald">Active</Badge>
          <p className="mt-2 text-sm text-gray-500">Account Status</p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h2>
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
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/profile"
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <User size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">View Profile</p>
              <p className="text-sm text-gray-500">See and update your account details</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
