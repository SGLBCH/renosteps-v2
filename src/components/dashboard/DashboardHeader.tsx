'use client'

import { Bars3Icon } from '@heroicons/react/24/outline'
import CreateProjectButton from './CreateProjectButton'

interface DashboardHeaderProps {
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export default function DashboardHeader({ onToggleSidebar, sidebarOpen }: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button - only show when sidebar is closed */}
            {!sidebarOpen && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            )}
            
            <h1 className="text-2xl font-bold text-gray-900">
              No Projects
            </h1>
          </div>
          
          <CreateProjectButton />
        </div>
      </div>
    </header>
  )
}
