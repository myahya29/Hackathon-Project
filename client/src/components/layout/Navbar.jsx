import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, LayoutDashboard, User, ShieldCheck, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function getInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const closeAll = () => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 text-base font-black text-slate-900" onClick={closeAll}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-lg shadow-sm">
            CCP
          </div>
          <span className="tracking-tight">Citizen Redressal Portal</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-4 md:flex">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700"
              >
                Register Account
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 py-1.5 pl-2 pr-3 transition hover:bg-slate-50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                  {getInitials(user?.name)}
                </span>
                <span className="text-xs font-bold text-slate-800">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl animate-fadeIn">
                  <Link
                    to="/dashboard"
                    onClick={closeAll}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard size={16} /> Portal Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={closeAll}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <User size={16} /> My Profile
                  </Link>
                  {user?.role === 'officer' && (
                    <Link
                      to="/dashboard?tab=officer"
                      onClick={closeAll}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50"
                    >
                      <ShieldCheck size={16} /> Officer Operations
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      closeAll()
                      logout()
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="text-slate-600 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={closeAll} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeAll}
                className="rounded-xl bg-blue-600 px-3 py-2 text-center text-sm font-bold text-white"
              >
                Register Account
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Link to="/dashboard" onClick={closeAll} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                <LayoutDashboard size={16} /> Portal Dashboard
              </Link>
              <Link to="/profile" onClick={closeAll} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                <User size={16} /> My Profile
              </Link>
              {user?.role === 'officer' && (
                <Link to="/dashboard?tab=officer" onClick={closeAll} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50">
                  <ShieldCheck size={16} /> Officer Operations
                </Link>
              )}
              <button
                onClick={() => {
                  closeAll()
                  logout()
                }}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
