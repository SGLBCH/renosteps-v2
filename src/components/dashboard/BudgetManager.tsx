'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { PlusIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import CreateBudgetItemModal from './CreateBudgetItemModal'

interface BudgetItem {
  id: string
  category: string
  description: string
  allocated_amount: number
  actual_spent: number
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled'
  due_date?: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  vendor_contractor?: string
  receipt_invoice?: string
  notes?: string
  created_at: string
}

interface BudgetManagerProps {
  projectId: string
}

const CATEGORIES = [
  'All',
  'Materials',
  'Labor',
  'Permits',
  'Tools',
  'Equipment',
  'Subcontractors',
  'Utilities',
  'Insurance',
  'Transportation',
  'Other'
]

const STATUSES = ['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'] as const

export default function BudgetManager({ projectId }: BudgetManagerProps) {
  const { user } = useAuth()
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Pending' | 'In Progress' | 'Completed' | 'Cancelled'>('All')
  const [error, setError] = useState<string | null>(null)

  const fetchBudgetItems = useCallback(async () => {
    if (!user || !projectId) return

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      let query = supabase
        .from('budget_items')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      // Apply category filter if not "All"
      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory)
      }

      // Apply status filter if not "All"
      if (selectedStatus !== 'All') {
        query = query.eq('status', selectedStatus)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching budget items:', error)
        setError('Failed to load budget items')
        return
      }

      setBudgetItems(data || [])
    } catch (error) {
      console.error('Error fetching budget items:', error)
      setError('Failed to load budget items')
    } finally {
      setLoading(false)
    }
  }, [user, projectId, selectedCategory, selectedStatus])

  // Fetch budget items when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      fetchBudgetItems()
    }
  }, [projectId, fetchBudgetItems])

  const handleBudgetItemCreated = () => {
    fetchBudgetItems() // Refresh the budget items list
  }

  const handleDeleteBudgetItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this budget item?')) return

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('budget_items')
        .delete()
        .eq('id', itemId)

      if (error) {
        console.error('Error deleting budget item:', error)
        alert('Failed to delete budget item')
        return
      }

      // Remove item from local state
      setBudgetItems(budgetItems.filter(item => item.id !== itemId))
      alert('Budget item deleted successfully')
    } catch (error) {
      console.error('Error deleting budget item:', error)
      alert('Failed to delete budget item')
    }
  }

  const filteredBudgetItems = budgetItems.filter(item => {
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory
    const statusMatch = selectedStatus === 'All' || item.status === selectedStatus
    return categoryMatch && statusMatch
  })

  // Calculate budget summary
  const budgetSummary = {
    totalAllocated: budgetItems.reduce((sum, item) => sum + (item.allocated_amount || 0), 0),
    totalSpent: budgetItems.reduce((sum, item) => sum + (item.actual_spent || 0), 0),
    remaining: budgetItems.reduce((sum, item) => sum + (item.allocated_amount || 0), 0) - 
               budgetItems.reduce((sum, item) => sum + (item.actual_spent || 0), 0),
    percentageUsed: budgetItems.reduce((sum, item) => sum + (item.allocated_amount || 0), 0) > 0 
      ? (budgetItems.reduce((sum, item) => sum + (item.actual_spent || 0), 0) / 
         budgetItems.reduce((sum, item) => sum + (item.allocated_amount || 0), 0)) * 100 
      : 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Pending':
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
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
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getProgressColor = (allocated: number, spent: number) => {
    if (allocated === 0) return 'bg-gray-300'
    const percentage = (spent / allocated) * 100
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    if (percentage >= 50) return 'bg-blue-500'
    return 'bg-green-500'
  }

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
          onClick={fetchBudgetItems}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Budget Item button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Budget Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Budget Item
        </button>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">${budgetSummary.totalAllocated.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${budgetSummary.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-gray-900">${budgetSummary.remaining.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm font-bold text-gray-700">{budgetSummary.percentageUsed.toFixed(1)}%</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Used</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(budgetSummary.totalAllocated, budgetSummary.totalSpent)}`}
                  style={{ width: `${Math.min(budgetSummary.percentageUsed, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="statusFilter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as 'All' | 'Pending' | 'In Progress' | 'Completed' | 'Cancelled')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Budget Items List */}
      {filteredBudgetItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <CurrencyDollarIcon className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No budget items found</h3>
          <p className="text-gray-500 mb-4">
            {selectedCategory !== 'All' || selectedStatus !== 'All'
              ? `No budget items found with the selected filters.`
              : "Get started by creating your first budget item."
            }
          </p>
          {(selectedCategory !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={() => {
                setSelectedCategory('All')
                setSelectedStatus('All')
              }}
              className="text-black hover:text-gray-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBudgetItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.description}</div>
                        {item.vendor_contractor && (
                          <div className="text-sm text-gray-500">{item.vendor_contractor}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${item.allocated_amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${item.actual_spent.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(item.allocated_amount, item.actual_spent)}`}
                            style={{ width: `${Math.min((item.actual_spent / item.allocated_amount) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {item.allocated_amount > 0 ? ((item.actual_spent / item.allocated_amount) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteBudgetItem(item.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Budget Item Modal */}
      <CreateBudgetItemModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        projectId={projectId}
        onBudgetItemCreated={handleBudgetItemCreated}
      />
    </div>
  )
}
