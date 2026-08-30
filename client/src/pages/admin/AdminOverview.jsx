import { useEffect, useState } from 'react'
import { Users, ShieldCheck, UserPlus } from 'lucide-react'
import { userService } from '../../api/userService'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

export default function AdminOverview() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await userService.list(1, 100)
        setUsers(res.data?.users || res.data || [])
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Loader label="Loading overview…" />

  const totalUsers = users.length
  const admins = users.filter((u) => u.role === 'admin').length
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  // TODO: this is calculated client-side from the fetched list; consider a
  // dedicated backend aggregate endpoint if the user list grows large.
  const newThisWeek = users.filter((u) => u.createdAt && new Date(u.createdAt) >= oneWeekAgo).length

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div className="animate-fadeIn space-y-8">
      <section className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 border-t-[3px] border-t-indigo-600 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:border-t-indigo-500 dark:bg-slate-900">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Users size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">Total Users</p>
        </div>
        <div className="rounded-2xl border border-gray-100 border-t-[3px] border-t-violet-600 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:border-t-violet-500 dark:bg-slate-900">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
            <ShieldCheck size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{admins}</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">Admins</p>
        </div>
        <div className="rounded-2xl border border-gray-100 border-t-[3px] border-t-emerald-600 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:border-t-emerald-500 dark:bg-slate-900">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <UserPlus size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{newThisWeek}</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">New This Week</p>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400 dark:border-slate-800 dark:text-slate-500">
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Email</th>
                <th className="pb-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u._id} className="border-b border-gray-50 last:border-0 dark:border-slate-800/60">
                  <td className="py-3 pr-4 font-medium text-gray-800 dark:text-slate-200">{u.name}</td>
                  <td className="py-3 pr-4 text-gray-500 dark:text-slate-400">{u.email}</td>
                  <td className="py-3 text-gray-500 dark:text-slate-400">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-400 dark:text-slate-500">
                    No users yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
