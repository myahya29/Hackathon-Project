import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const validate = () => {
    const next = {}
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!emailRegex.test(form.email)) next.email = 'Enter a valid email address'
    if (!form.password) next.password = 'Password is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return

    setLoading(true)
    const success = await login(form.email.trim(), form.password)
    setLoading(false)

    if (success) {
      navigate('/dashboard')
    } else {
      setFormError('Invalid credentials. Please verify your email and password.')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-white px-4 py-10">
      <div className="sq-card w-full max-w-sm p-6 border border-slate-200">
        <div className="mb-5 text-center space-y-1">
          <img src="/logo.png" alt="Citizen Complaint Portal Logo" className="mx-auto mb-4 h-24 w-24 object-contain drop-shadow-md" />
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Citizen & Officer Login</h1>
          <p className="text-xs font-medium text-slate-500">Access the Citizen Complaint Portal</p>
        </div>

        {formError && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2.5 text-xs text-rose-700 font-semibold">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-700">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="citizen@portal.gov"
                className={`w-full rounded-lg bg-slate-50 border py-2 pl-9 pr-3 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                }`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-700">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className={`w-full rounded-lg bg-slate-50 border py-2 pl-9 pr-9 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {loading ? 'Logging in...' : 'Sign In to Portal'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500 font-medium">
          New citizen user?{' '}
          <Link to="/signup" className="font-bold text-emerald-600 hover:text-emerald-700">
            Register Account
          </Link>
        </p>
      </div>
    </div>
  )
}
