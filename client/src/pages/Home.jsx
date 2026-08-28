import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Zap, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white">
      <section className="mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="animate-fadeIn mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
          <Zap size={14} /> Fast, secure authentication starter
        </span>
        <h1 className="animate-slideUp text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Ship your product,
          <br className="hidden sm:block" /> not your auth flow.
        </h1>
        <p className="animate-slideUp mt-6 max-w-2xl text-lg text-gray-600" style={{ animationDelay: '0.1s' }}>
          Sign up, log in, and manage your account with a clean, secure dashboard —
          built on a role-based access system that's ready for whatever you build next.
        </p>

        <div className="animate-slideUp mt-10 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '0.2s' }}>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700"
            >
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700"
              >
                Get Started <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {isAuthenticated && (
          <p className="mt-4 text-sm text-gray-500">
            Signed in as <span className="font-medium text-gray-700">{user?.email}</span>
          </p>
        )}
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-24 sm:grid-cols-3 sm:px-6 lg:px-8">
        {[
          { icon: ShieldCheck, title: 'Secure by default', text: 'Token-based auth with protected and role-gated routes.' },
          { icon: Users, title: 'User management', text: 'Admins can view, promote, and manage every account.' },
          { icon: Zap, title: 'Fast to extend', text: 'A clean foundation ready for your next feature.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Icon size={20} />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
