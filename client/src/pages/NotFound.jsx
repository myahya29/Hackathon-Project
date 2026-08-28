import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-140px)] flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <p className="animate-slideUp text-7xl font-extrabold text-indigo-600">404</p>
      <h1 className="animate-slideUp mt-4 text-2xl font-bold text-gray-900" style={{ animationDelay: '0.05s' }}>
        Page not found
      </h1>
      <p className="animate-slideUp mt-2 max-w-sm text-sm text-gray-500" style={{ animationDelay: '0.1s' }}>
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="animate-slideUp mt-8 flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700"
        style={{ animationDelay: '0.15s' }}
      >
        <Home size={16} /> Go Home
      </Link>
    </div>
  )
}
