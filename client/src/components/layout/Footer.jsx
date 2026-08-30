export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs font-semibold text-slate-500 sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Citizen Complaint Portal — Official Municipal Portal.</p>
        <div className="flex gap-4">
          <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-800 cursor-pointer">Terms of Service</span>
          <span className="hover:text-slate-800 cursor-pointer">Municipal Support</span>
        </div>
      </div>
    </footer>
  )
}
