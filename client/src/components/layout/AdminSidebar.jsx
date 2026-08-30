import { NavLink } from 'react-router-dom'
import { LayoutGrid, Users, Settings, X } from 'lucide-react'

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-100 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <span className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">A</span>
            Admin
          </span>
          <button className="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-white lg:hidden" onClick={onClose} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-4 text-xs text-gray-400 dark:border-slate-800 dark:text-slate-500">
          Admin console v1.0
        </div>
      </aside>
    </>
  )
}
