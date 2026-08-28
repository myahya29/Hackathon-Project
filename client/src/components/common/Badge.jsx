const colorMap = {
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  gray: 'bg-gray-100 text-gray-600 ring-gray-500/20',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  rose: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
}

export default function Badge({ color = 'gray', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${colorMap[color] || colorMap.gray}`}
    >
      {children}
    </span>
  )
}
