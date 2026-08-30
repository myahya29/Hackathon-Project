import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FileText,
  Plus,
  FolderHeart,
  SearchCheck,
  Shield,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Sparkles,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function PortalLayout({
  children,
  activeTab,
  setActiveTab,
  onOpenNewComplaint,
  onExportCSV,
  searchQuery,
  setSearchQuery,
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isOfficer = user?.role === 'officer'

  const mainNav = [
    {
      id: 'all',
      label: 'All Complaints',
      icon: FileText,
      path: '/dashboard?tab=all',
    },
    {
      id: 'mine',
      label: 'My Complaints',
      icon: FolderHeart,
      path: '/dashboard?tab=mine',
    },
    {
      id: 'duplicate',
      label: 'Duplicate Check',
      icon: SearchCheck,
      path: '/dashboard?tab=duplicate',
    },
    ...(isOfficer
      ? [
          {
            id: 'officer',
            label: 'Officer Panel',
            icon: Shield,
            path: '/dashboard?tab=officer',
          },
        ]
      : []),
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
      path: '/profile',
    },
  ]

  const handleNavClick = (item) => {
    setMobileOpen(false)
    if (item.path.startsWith('/dashboard')) {
      if (location.pathname !== '/dashboard') {
        navigate(item.path)
      } else if (setActiveTab) {
        setActiveTab(item.id)
      }
    } else {
      navigate(item.path)
    }
  }

  return (
    <div className="flex min-h-screen bg-white text-slate-800 font-sans relative">
      {/* MOBILE BACKDROP OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* MOBILE DRAWER SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-250 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-100">
            <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Citizen Complaint Portal Logo" className="h-12 w-12 object-contain shrink-0 drop-shadow-md" />
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-sm leading-tight">Citizen</span>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Complaint Portal</span>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-3">
            <button
              onClick={() => {
                setMobileOpen(false)
                onOpenNewComplaint()
              }}
              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>New Complaint</span>
            </button>
          </div>

          <nav className="px-2 py-1 space-y-0.5">
            <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5 px-3">
              Navigation
            </div>
            {mainNav.map((item) => {
              const Icon = item.icon
              const isActive =
                (location.pathname === '/profile' && item.id === 'profile') ||
                (location.pathname === '/dashboard' && activeTab === item.id)

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-bold border-l-3 border-emerald-600 rounded-l-none'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</span>
                <span className="text-[10px] text-emerald-700 font-semibold uppercase">
                  {user?.role === 'officer' ? 'Officer' : 'Citizen'}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* DESKTOP STICKY SIDEBAR */}
      <aside
        className={`hidden md:flex bg-white border-r border-slate-200 flex-col justify-between transition-all duration-250 z-30 sticky top-0 h-screen ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
        <div>
          <div className="h-16 flex items-center justify-between px-3 border-b border-slate-100">
            <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
              <img src="/logo.png" alt="Citizen Complaint Portal Logo" className="h-12 w-12 object-contain shrink-0 drop-shadow-md" />
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900 text-sm leading-tight">Citizen</span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Complaint Portal</span>
                </div>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <div className="p-3">
            <button
              onClick={onOpenNewComplaint}
              className={`w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                collapsed ? 'px-0' : ''
              }`}
            >
              <Plus size={16} strokeWidth={2.5} />
              {!collapsed && <span>New Complaint</span>}
            </button>
          </div>

          <nav className="px-2 py-1 space-y-0.5">
            {!collapsed && (
              <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5 px-3">
                Navigation
              </div>
            )}
            {mainNav.map((item) => {
              const Icon = item.icon
              const isActive =
                (location.pathname === '/profile' && item.id === 'profile') ||
                (location.pathname === '/dashboard' && activeTab === item.id)

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-bold border-l-3 border-emerald-600 rounded-l-none'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={16} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              {!collapsed && (
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold uppercase">
                    {user?.role === 'officer' ? 'Officer' : 'Citizen'}
                  </span>
                </div>
              )}
            </div>
            {!collapsed && (
              <button
                onClick={logout}
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Logout"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* COMPACT HEADER BAR */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-5 py-2.5 sm:py-0 h-auto sm:h-14 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sticky top-0 z-20">
          <div className="flex items-center gap-2.5 w-full sm:max-w-sm">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden shrink-0 border border-slate-200"
              title="Open Navigation Menu"
            >
              <Menu size={18} />
            </button>

            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search complaints by title, area..."
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
            {isOfficer && onExportCSV && (
              <button
                onClick={onExportCSV}
                className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Download size={13} />
                <span>Export Complaints CSV</span>
              </button>
            )}
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="flex-1 p-4 sm:p-5 overflow-y-auto bg-white">{children}</main>
      </div>
    </div>
  )
}
