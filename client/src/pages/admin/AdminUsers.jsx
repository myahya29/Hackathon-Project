import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Search, Trash2, Users as UsersIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { userService } from '../../api/userService'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'

function getInitials(name = '') {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
}

const LIMIT = 10

export default function AdminUsers() {
  const { user: currentUser } = useAuth()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [rowLoading, setRowLoading] = useState({}) // { [userId]: true }
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchUsers = async (pageNum) => {
    setLoading(true)
    try {
      const res = await userService.list(pageNum, LIMIT)
      const list = res.data?.users || res.data || []
      setUsers(list)
      setTotalPages(res.data?.totalPages || res.totalPages || 1)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  )

  const handleRoleChange = async (id, newRole) => {
    setRowLoading((prev) => ({ ...prev, [id]: true }))
    try {
      await userService.update(id, { role: newRole })
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)))
      toast.success('Role updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role')
    } finally {
      setRowLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await userService.remove(deleteTarget._id)
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id))
      toast.success('User deleted')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="animate-fadeIn space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-violet-400 dark:focus:ring-violet-400"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 dark:bg-slate-800/50 dark:text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-gray-50 dark:border-slate-800/60">
                    <td className="px-5 py-4"><div className="h-4 w-40 animate-pulse rounded bg-gray-100 dark:bg-slate-800" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-20 animate-pulse rounded bg-gray-100 dark:bg-slate-800" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-24 animate-pulse rounded bg-gray-100 dark:bg-slate-800" /></td>
                    <td className="px-5 py-4"><div className="ml-auto h-4 w-16 animate-pulse rounded bg-gray-100 dark:bg-slate-800" /></td>
                  </tr>
                ))}

              {!loading &&
                filtered.map((u) => {
                  const isSelf = u._id === currentUser?._id
                  return (
                    <tr key={u._id} className="border-t border-gray-50 hover:bg-gray-50/60 dark:border-slate-800/60 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                            {getInitials(u.name)}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Badge color={u.role === 'admin' ? 'violet' : 'gray'}>{u.role}</Badge>
                          <select
                            value={u.role}
                            disabled={isSelf || rowLoading[u._id]}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            title={isSelf ? "You can't modify your own account" : undefined}
                            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-violet-400"
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 dark:text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setDeleteTarget(u)}
                          disabled={isSelf}
                          title={isSelf ? "You can't modify your own account" : 'Delete user'}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-rose-600 transition-all duration-200 hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent dark:text-rose-400 dark:hover:bg-rose-500/10 dark:disabled:text-slate-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length === 0 && (
          <EmptyState icon={UsersIcon} title="No users found" message="Try a different search term." />
        )}

        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-slate-800">
          <p className="text-xs text-gray-400 dark:text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete user"
        message={`Delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
