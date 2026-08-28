export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-sm text-gray-500 sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Authly. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-700">Privacy</a>
          <a href="#" className="hover:text-gray-700">Terms</a>
          <a href="#" className="hover:text-gray-700">Support</a>
        </div>
      </div>
    </footer>
  )
}
