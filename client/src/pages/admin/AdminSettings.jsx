import { useState } from 'react'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${checked ? 'bg-indigo-600' : 'bg-gray-200'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  )
}

export default function AdminSettings() {
  // TODO: these are local-only placeholder toggles; wire to a real
  // settings endpoint once one exists on the backend.
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  return (
    <div className="animate-fadeIn max-w-2xl">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Admin Settings</h2>
        <p className="mb-6 text-sm text-gray-500">
          These preferences are placeholders for now — TODO: connect to a real settings endpoint.
        </p>

        <div className="divide-y divide-gray-100">
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-gray-800">Email notifications</p>
              <p className="text-xs text-gray-500">Get notified about important account activity</p>
            </div>
            <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-gray-800">Maintenance mode</p>
              <p className="text-xs text-gray-500">Temporarily restrict access to non-admin users</p>
            </div>
            <Toggle checked={maintenanceMode} onChange={setMaintenanceMode} />
          </div>
        </div>
      </div>
    </div>
  )
}
