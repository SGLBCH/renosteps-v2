'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { PlusIcon } from '@heroicons/react/24/outline'
import CreateTaskModal from './CreateTaskModal'
import TaskCard from './TaskCard'

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

interface TasksListProps {
  projectId: string
}

const CATEGORIES = [
  'All',
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

export default function TasksList({ projectId }: TasksListProps) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [error, setError] = useState<string | null>(null)

  // Fetch tasks when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      fetchTasks()
    }
  }, [projectId])

  const fetchTasks = async () => {
    if (!user || !projectId) return

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      // Apply category filter if not "All"
      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching tasks:', error)
        setError('Failed to load tasks')
        return
      }

      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = () => {
    fetchTasks() // Refresh the tasks list
  }

  const handleEditTask = (task: Task) => {
    // TODO: Implement edit functionality
    console.log('Edit task:', task)
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) {
        console.error('Error deleting task:', error)
        alert('Failed to delete task')
        return
      }

      // Remove task from local state
      setTasks(tasks.filter(task => task.id !== taskId))
      alert('Task deleted successfully')
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('Failed to delete task')
    }
  }

  const filteredTasks = selectedCategory === 'All' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchTasks}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Task button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Task
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 text-sm font-medium rounded-full border transition-colors ${
              selectedCategory === category
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500 mb-4">
            {selectedCategory === 'All' 
              ? "Get started by creating your first task."
              : `No tasks found in the ${selectedCategory} category.`
            }
          </p>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-black hover:text-gray-700 font-medium"
            >
              View all tasks
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        projectId={projectId}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  )
}
