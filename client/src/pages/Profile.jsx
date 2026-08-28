import { useState } from 'react'
import toast from 'react-hot-toast'
import { Save, KeyRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Badge from '../components/common/Badge'

function getInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Profile() {
  const { user } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [nameError, setNameError] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  const [passwords, setPasswords] = useState({ current: '', next: '' })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [savingPassword, setSavingPassword] = useState(false)

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  // NOTE: the backend does not currently expose a "update profile" endpoint,
  // so this simulates the request and just confirms via toast. Swap this
  // out for a real API call (e.g. PUT /api/users/me) once it exists.
  const handleProfileSave = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('Name is required')
      return
    }
    setNameError('')
    setSavingProfile(true)
    setTimeout(() => {
      setSavingProfile(false)
      toast.success('Feature coming soon — profile updates aren\'t wired to the backend yet.')
    }, 600)
  }

  // NOTE: same as above — there is no change-password route on the backend
  // yet. The UI and validation are fully built and ready to be connected.
  const handlePasswordSave = (e) => {
    e.preventDefault()
    const next = {}
    if (!passwords.current) next.current = 'Current password is required'
    if (!passwords.next) next.next = 'New password is required'
    else if (passwords.next.length < 6) next.next = 'New password must be at least 6 characters'
    setPasswordErrors(next)
    if (Object.keys(next).length > 0) return

    setSavingPassword(true)
    setTimeout(() => {
      setSavingPassword(false)
      setPasswords({ current: '', next: '' })
      toast.success('Feature coming soon — password changes aren\'t wired to the backend yet.')
    }, 600)
  }

  return (
    <div className="animate-fadeIn mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Profile</h1>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
              {getInitials(user?.name)}
            </div>
          )}
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
              <Badge color={user?.role === 'admin' ? 'indigo' : 'gray'}>{user?.role}</Badge>
              <span className="text-xs text-gray-400">Member since {memberSince}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Update Profile</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                nameError
                  ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {nameError && <p className="mt-1 text-xs text-rose-600">{nameError}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 disabled:opacity-60"
          >
            <Save size={16} />
            {savingProfile ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Change Password</h2>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Current password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                passwordErrors.current
                  ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {passwordErrors.current && <p className="mt-1 text-xs text-rose-600">{passwordErrors.current}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">New password</label>
            <input
              type="password"
              value={passwords.next}
              onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                passwordErrors.next
                  ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {passwordErrors.next && <p className="mt-1 text-xs text-rose-600">{passwordErrors.next}</p>}
          </div>
          <button
            type="submit"
            disabled={savingPassword}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 disabled:opacity-60"
          >
            <KeyRound size={16} />
            {savingPassword ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </section>
    </div>
  )
}
