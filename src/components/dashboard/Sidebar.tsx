'use client'

import { User } from '@supabase/supabase-js'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import CreateProjectButton from './CreateProjectButton'

interface Project {
  id: string
  name: string
  start_date: string
  end_date: string
  status: string
}

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  user: User | null
  onSignOut: () => void
  projects: Project[]
  selectedProjectId: string | null
  onProjectSelect: (projectId: string) => void
  onProjectCreated: () => void
}

export default function Sidebar({ 
  isOpen, 
  onToggle, 
  user, 
  onSignOut, 
  projects, 
  selectedProjectId, 
  onProjectSelect, 
  onProjectCreated 
}: SidebarProps) {
  const selectedProject = projects.find(p => p.id === selectedProjectId)

  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Toggle Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          {isOpen ? (
            <ChevronLeftIcon className="h-5 w-5" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* User Info */}
      {isOpen && (
        <div className="px-4 py-3 border-b border-gray-700">
          <div className="text-sm text-gray-300">Logged in as</div>
          <div className="font-medium truncate">{user?.email}</div>
        </div>
      )}

      {/* Project Selection */}
      {isOpen && (
        <div className="px-4 py-3 border-b border-gray-700">
          <div className="text-sm text-gray-300 mb-2">Select Project</div>
          {projects.length > 0 ? (
            <select
              value={selectedProjectId || ''}
              onChange={(e) => onProjectSelect(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-sm text-gray-400">No projects yet</div>
          )}
          
          {/* Create Project Button */}
          <div className="mt-3">
            <CreateProjectButton onProjectCreated={onProjectCreated} />
          </div>
        </div>
      )}

      {/* Project Overview */}
      {isOpen && selectedProject && (
        <div className="px-4 py-3 border-b border-gray-700">
          <div className="text-sm text-gray-300 mb-2">Project Overview</div>
          <div className="text-sm text-white font-medium mb-1">{selectedProject.name}</div>
          <div className="text-xs text-gray-400">
            {new Date(selectedProject.start_date).toLocaleDateString()} - {new Date(selectedProject.end_date).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-400 capitalize">
            Status: {selectedProject.status}
          </div>
        </div>
      )}

      {/* Budget Overview Placeholder */}
      {isOpen && selectedProject && (
        <div className="px-4 py-3 border-b border-gray-700">
          <div className="text-sm text-gray-300 mb-2">Budget Overview</div>
          <div className="text-xs text-gray-400">No project selected</div>
        </div>
      )}

      {/* Contractors Placeholder */}
      {isOpen && (
        <div className="px-4 py-3 border-b border-gray-700">
          <div className="text-sm text-gray-300 mb-2">Contractors</div>
          <div className="text-xs text-gray-400">Loading contractors...</div>
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-6">
        <div className="px-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            {isOpen ? 'Navigation' : ''}
          </div>
        </div>
        
        <ul className="space-y-1">
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              {isOpen && 'Dashboard'}
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {isOpen && 'Tasks'}
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {isOpen && 'Gantt'}
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              {isOpen && 'Budget'}
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {isOpen && 'Ideas'}
            </a>
          </li>
        </ul>
      </nav>

      {/* Sign Out Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={onSignOut}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-md"
        >
          <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {isOpen && 'Sign Out'}
        </button>
      </div>
    </div>
  )
}
