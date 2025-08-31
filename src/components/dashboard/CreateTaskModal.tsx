'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'

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

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  onTaskCreated: () => void
}

const CATEGORIES = [
  'Kitchen',
  'Bathroom', 
  'Living Room',
  'Bedroom',
  'Exterior',
  'Basement',
  'Attic',
  'Garage',
  'Garden',
  'Other'
]

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const
const STATUSES = ['Not Started', 'In Progress', 'On Hold', 'Completed', 'Cancelled'] as const

export default function CreateTaskModal({ isOpen, onClose, projectId, onTaskCreated }: CreateTaskModalProps) {
  const { user } = useAuth()
  const [isCreating, setIsCreating] = useState(false)
  
  // Form fields
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium')
  const [description, setDescription] = useState('')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'Not Started' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled'>('Not Started')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [estimatedHours, setEstimatedHours] = useState('')
  const [materialsNeeded, setMaterialsNeeded] = useState('')
  const [budgetAllocation, setBudgetAllocation] = useState('')
  const [roomLocation, setRoomLocation] = useState('')

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetForm()
    }
  }, [isOpen])

  const resetForm = () => {
    setTitle('')
    setCategory('')
    setPriority('Medium')
    setDescription('')
    setProgress(0)
    setStatus('Not Started')
    setStartDate('')
    setEndDate('')
    setEstimatedHours('')
    setMaterialsNeeded('')
    setBudgetAllocation('')
    setRoomLocation('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !title.trim() || !category || !startDate || !endDate) {
      alert('Please fill in all required fields')
      return
    }

    // Validate dates
    if (new Date(endDate) <= new Date(startDate)) {
      alert('End date must be after start date')
      return
    }

    setIsCreating(true)
    
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            project_id: projectId,
            title: title.trim(),
            category,
            priority,
            description: description.trim(),
            progress,
            status,
            start_date: startDate,
            end_date: endDate,
            estimated_hours: estimatedHours ? parseFloat(estimatedHours) : null,
            materials_needed: materialsNeeded.trim() || null,
            budget_allocation: budgetAllocation ? parseFloat(budgetAllocation) : null,
            room_location: roomLocation.trim() || null,
            dependencies: []
          }
        ])
        .select()

      if (error) {
        console.error('Error creating task:', error)
        alert(`Failed to create task: ${error.message || 'Unknown error'}`)
        return
      }

      // Success - reset form and close modal
      resetForm()
      onClose()
      onTaskCreated()
      
      alert('Task created successfully!')
      
    } catch (error) {
      console.error('Error creating task:', error)
      alert('Failed to create task. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Create New Task
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  required
                >
                  {PRIORITIES.map((pri) => (
                    <option key={pri} value={pri}>{pri}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Enter task description"
              />
            </div>

            {/* Progress and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-2">
                  Progress: {progress}%
                </label>
                <input
                  type="range"
                  id="progress"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  required
                >
                  {STATUSES.map((stat) => (
                    <option key={stat} value={stat}>{stat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  id="estimatedHours"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  min="0"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>

              <div>
                <label htmlFor="budgetAllocation" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Allocation ($)
                </label>
                <input
                  type="number"
                  id="budgetAllocation"
                  value={budgetAllocation}
                  onChange={(e) => setBudgetAllocation(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Materials and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="materialsNeeded" className="block text-sm font-medium text-gray-700 mb-2">
                  Materials Needed
                </label>
                <textarea
                  id="materialsNeeded"
                  value={materialsNeeded}
                  onChange={(e) => setMaterialsNeeded(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="List required materials"
                />
              </div>

              <div>
                <label htmlFor="roomLocation" className="block text-sm font-medium text-gray-700 mb-2">
                  Room/Location
                </label>
                <input
                  type="text"
                  id="roomLocation"
                  value={roomLocation}
                  onChange={(e) => setRoomLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="e.g., Kitchen - Upper Cabinets"
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || !title.trim() || !category || !startDate || !endDate}
                className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors flex items-center"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
