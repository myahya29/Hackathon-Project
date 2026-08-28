import { useState } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { Menu, ChevronDown, User, ArrowLeftCircle, LogOut } from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import { useAuth } from '../../context/AuthContext'

const titleMap = {
  '/admin': 'Overview',
  '/admin/users': 'Users',
  '/admin/settings': 'Settings',
}

function getInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const pageTitle = titleMap[location.pathname] || 'Admin'

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="text-gray-500 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 py-1.5 pl-1.5 pr-3 transition-all duration-200 hover:bg-gray-50"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                {getInitials(user?.name)}
              </span>
              <span className="hidden text-sm font-medium text-gray-700 sm:inline">{user?.name}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 bg-white p-1.5 shadow-md animate-fadeIn">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User size={16} /> Profile
                </Link>
                <Link
                  to="/"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeftCircle size={16} /> Back to main site
                </Link>
                <button
                  onClick={() => {
                    setDropdownOpen(false)
                    logout()
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
