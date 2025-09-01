'use client'

import { useState } from 'react'
import TasksList from './TasksList'
import BudgetManager from './BudgetManager'

type TabType = 'dashboard' | 'tasks' | 'gantt' | 'budget' | 'ideas'

interface DashboardContentProps {
  projectId?: string
}

export default function DashboardContent({ projectId }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'gantt', label: 'Gantt' },
    { id: 'budget', label: 'Budget' },
    { id: 'ideas', label: 'Ideas' }
  ]

  const renderTabContent = () => {
    if (!projectId) {
      return (
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Dashboard
          </h2>
          <p className="text-lg text-gray-500">
            No project selected
          </p>
        </div>
      )
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dashboard
            </h2>
            <p className="text-lg text-gray-500">
              Project overview and summary will appear here
            </p>
          </div>
        )
      case 'tasks':
        return <TasksList projectId={projectId} />
      case 'gantt':
        return (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Gantt Chart
            </h2>
            <p className="text-lg text-gray-500">
              Gantt chart view coming soon
            </p>
          </div>
        )
      case 'budget':
        return <BudgetManager projectId={projectId} />
      case 'ideas':
        return (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ideas
            </h2>
            <p className="text-lg text-gray-500">
              Project ideas and inspiration coming soon
            </p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-2 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        {renderTabContent()}
      </div>
    </main>
  )
}
