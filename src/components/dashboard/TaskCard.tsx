'use client'

import { CalendarIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface Task {
  id: string
  title: string
  category: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  description: string
  progress: number
  status: 'Not Started' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled'
  start_date: string
  end_date: string
  estimated_hours?: number
  materials_needed?: string
  budget_allocation?: number
  room_location?: string
}

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'High':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'Medium':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Low':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'On Hold':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Cancelled':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'Not Started':
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed':
      return <CheckCircleIcon className="h-4 w-4" />
    case 'In Progress':
      return <ClockIcon className="h-4 w-4" />
    case 'On Hold':
      return <ExclamationTriangleIcon className="h-4 w-4" />
    case 'Cancelled':
      return <ExclamationTriangleIcon className="h-4 w-4" />
    case 'Not Started':
    default:
      return <CalendarIcon className="h-4 w-4" />
  }
}

const getCategoryIcon = () => {
  // You can add custom icons for each category here
  return '🏠'
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 20) return 'bg-yellow-500'
    return 'bg-gray-300'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getCategoryIcon()}</span>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {task.title}
          </h3>
        </div>
        
        {/* Priority Badge */}
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {/* Category */}
      <div className="mb-3">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {task.category}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs font-medium text-gray-700">{task.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(task.progress)}`}
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center space-x-2 mb-3">
        {getStatusIcon(task.status)}
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>

      {/* Dates */}
      <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <CalendarIcon className="h-3 w-3" />
          <span>Start: {formatDate(task.start_date)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <CalendarIcon className="h-3 w-3" />
          <span>End: {formatDate(task.end_date)}</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
        {task.estimated_hours && (
          <div>⏱️ {task.estimated_hours}h</div>
        )}
        {task.budget_allocation && (
          <div>💰 ${task.budget_allocation.toLocaleString()}</div>
        )}
        {task.room_location && (
          <div className="col-span-2">📍 {task.room_location}</div>
        )}
      </div>

      {/* Materials (if any) */}
      {task.materials_needed && (
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Materials:</div>
          <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            {task.materials_needed}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
