import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

  const closeAll = () => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-gray-900" onClick={closeAll}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">A</span>
          Authly
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-4 md:flex">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 py-1.5 pl-1.5 pr-3 transition-all duration-200 hover:bg-gray-50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                  {getInitials(user?.name)}
                </span>
                <span className="text-sm font-medium text-gray-700">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 bg-white p-1.5 shadow-md animate-fadeIn">
                  <Link
                    to="/dashboard"
                    onClick={closeAll}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={closeAll}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User size={16} /> Profile
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={closeAll}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <ShieldCheck size={16} /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      closeAll()
                      logout()
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
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
          className="text-gray-600 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden animate-fadeIn">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={closeAll} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeAll}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Link to="/dashboard" onClick={closeAll} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/profile" onClick={closeAll} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <User size={16} /> Profile
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={closeAll} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <ShieldCheck size={16} /> Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  closeAll()
                  logout()
                }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
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
