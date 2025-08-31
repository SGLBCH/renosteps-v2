'use client'

export default function DashboardContent() {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <a
              href="#"
              className="border-b-2 border-gray-900 py-2 px-1 text-sm font-medium text-gray-900"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-2 px-1 text-sm font-medium"
            >
              Tasks
            </a>
            <a
              href="#"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-2 px-1 text-sm font-medium"
            >
              Gantt
            </a>
            <a
              href="#"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-2 px-1 text-sm font-medium"
            >
              Budget
            </a>
            <a
              href="#"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-2 px-1 text-sm font-medium"
            >
              Ideas
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Dashboard
          </h2>
          <p className="text-lg text-gray-500">
            No project selected
          </p>
        </div>
      </div>
    </main>
  )
}
