'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function CreateProjectButton({ onProjectCreated }: { onProjectCreated?: () => void }) {
  const { user } = useAuth()
  const [isCreating, setIsCreating] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !projectName.trim() || !startDate || !endDate) return

    // Validate that end date is after start date
    if (new Date(endDate) <= new Date(startDate)) {
      alert('End date must be after start date')
      return
    }

    setIsCreating(true)
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('projects')
        .insert([
          {
            name: projectName.trim(),
            start_date: startDate,
            end_date: endDate,
            user_id: user.id,
            status: 'active',
            created_at: new Date().toISOString()
          }
        ])

      if (error) {
        console.error('Error creating project:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        alert(`Failed to create project: ${error.message || 'Unknown error'}`)
        return
      }

      // Success - reset form and close modal
      setProjectName('')
      setStartDate('')
      setEndDate('')
      setShowModal(false)
      
      // Call the callback if provided
      if (onProjectCreated) {
        onProjectCreated()
      }
      
      // You can add a success message or redirect here
      alert('Project created successfully!')
      
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Create First Project
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Create New Project
              </h3>
              
              <form onSubmit={handleCreateProject}>
                <div className="mb-4">
                  <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Enter project name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
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
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !projectName.trim() || !startDate || !endDate}
                    className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors"
                  >
                    {isCreating ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
