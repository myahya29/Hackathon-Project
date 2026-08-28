const sizeMap = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
}

export default function Loader({ size = 'md', fullPage = false, label }) {
  const spinner = (
    <div
      className={`${sizeMap[size]} animate-spin rounded-full border-indigo-600 border-t-transparent`}
      role="status"
      aria-label={label || 'Loading'}
    />
  )

  if (fullPage) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-gray-50">
        {spinner}
        {label && <p className="text-sm text-gray-500">{label}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8">
      {spinner}
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  )
}
