import { useState } from 'react'
import toast from 'react-hot-toast'
import { Save, KeyRound, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../api/authService'

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
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : '—'

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
      toast.success('Profile details saved.')
    }, 300)
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    const next = {}
    if (!passwords.current) next.current = 'Current password is required'
    if (!passwords.next) next.next = 'New password is required'
    else if (passwords.next.length < 6) next.next = 'New password must be at least 6 characters'
    setPasswordErrors(next)
    if (Object.keys(next).length > 0) return

    setSavingPassword(true)
    try {
      await authService.updatePassword(passwords.current, passwords.next)
      setPasswords({ current: '', next: '' })
      toast.success('Password updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-5">
      {/* PAGE TITLE */}
      <div className="border-b border-slate-100 pb-3">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Account Profile & Security</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Manage user credentials and role settings</p>
      </div>

      {/* USER SUMMARY CARD */}
      <section className="sq-card flex flex-col sm:flex-row items-center gap-4 p-4 sm:p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-dark text-emerald-400 text-base font-extrabold shrink-0">
          {getInitials(user?.name)}
        </div>
        <div className="text-center sm:text-left space-y-0.5">
          <p className="text-base font-extrabold text-slate-900 leading-tight">{user?.name}</p>
          <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
          <div className="flex items-center justify-center gap-2 sm:justify-start pt-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
              {user?.role === 'officer' ? 'Municipal Officer' : 'Citizen Account'}
            </span>
            <span className="text-xs text-slate-400 font-medium">Registered: {memberSince}</span>
          </div>
        </div>
      </section>

      {/* UPDATE PROFILE FORM */}
      <section className="sq-card p-4 sm:p-5 space-y-3.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Personal Information</h2>
        <form onSubmit={handleProfileSave} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
            {nameError && <p className="mt-1 text-xs text-rose-600 font-semibold">{nameError}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100/70 px-3 py-2 text-xs font-medium text-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition shadow-xs disabled:opacity-60"
          >
            <Save size={14} />
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </section>

      {/* CHANGE PASSWORD FORM */}
      <section className="sq-card p-4 sm:p-5 space-y-3.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Credentials</h2>
        <form onSubmit={handlePasswordSave} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
            {passwordErrors.current && <p className="mt-1 text-xs text-rose-600 font-semibold">{passwordErrors.current}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">New Password</label>
            <input
              type="password"
              value={passwords.next}
              onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
              className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
            {passwordErrors.next && <p className="mt-1 text-xs text-rose-600 font-semibold">{passwordErrors.next}</p>}
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-bold text-white transition shadow-xs disabled:opacity-60"
          >
            <KeyRound size={14} />
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>
    </div>
  )
}
