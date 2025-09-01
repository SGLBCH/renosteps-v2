'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { XMarkIcon } from '@heroicons/react/24/outline'

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

interface EditBudgetItemModalProps {
  isOpen: boolean
  onClose: () => void
  budgetItem: BudgetItem | null
  onBudgetItemUpdated: () => void
}

const CATEGORIES = [
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

const STATUSES = ['Pending', 'In Progress', 'Completed', 'Cancelled'] as const
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const

export default function EditBudgetItemModal({ 
  isOpen, 
  onClose, 
  budgetItem, 
  onBudgetItemUpdated 
}: EditBudgetItemModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    allocated_amount: 0,
    actual_spent: 0,
    status: 'Pending' as 'Pending' | 'In Progress' | 'Completed' | 'Cancelled',
    due_date: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    vendor_contractor: '',
    receipt_invoice: '',
    notes: ''
  })

  useEffect(() => {
    if (budgetItem) {
      setFormData({
        category: budgetItem.category,
        description: budgetItem.description,
        allocated_amount: budgetItem.allocated_amount,
        actual_spent: budgetItem.actual_spent,
        status: budgetItem.status,
        due_date: budgetItem.due_date || '',
        priority: budgetItem.priority,
        vendor_contractor: budgetItem.vendor_contractor || '',
        receipt_invoice: budgetItem.receipt_invoice || '',
        notes: budgetItem.notes || ''
      })
    }
  }, [budgetItem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !budgetItem) return

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('budget_items')
        .update({
          category: formData.category,
          description: formData.description,
          allocated_amount: formData.allocated_amount,
          actual_spent: formData.actual_spent,
          status: formData.status,
          due_date: formData.due_date || null,
          priority: formData.priority,
          vendor_contractor: formData.vendor_contractor || null,
          receipt_invoice: formData.receipt_invoice || null,
          notes: formData.notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', budgetItem.id)

      if (error) {
        console.error('Error updating budget item:', error)
        setError('Failed to update budget item')
        return
      }

      onBudgetItemUpdated()
      onClose()
    } catch (error) {
      console.error('Error updating budget item:', error)
      setError('Failed to update budget item')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'allocated_amount' || name === 'actual_spent' ? parseFloat(value) || 0 : value
    }))
  }

  if (!isOpen || !budgetItem) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Budget Item</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority *
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Enter budget item description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="allocated_amount" className="block text-sm font-medium text-gray-700 mb-1">
                Allocated Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="allocated_amount"
                  name="allocated_amount"
                  value={formData.allocated_amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="actual_spent" className="block text-sm font-medium text-gray-700 mb-1">
                Actual Spent *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="actual_spent"
                  name="actual_spent"
                  value={formData.actual_spent}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="vendor_contractor" className="block text-sm font-medium text-gray-700 mb-1">
              Vendor/Contractor
            </label>
            <input
              type="text"
              id="vendor_contractor"
              name="vendor_contractor"
              value={formData.vendor_contractor}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Enter vendor or contractor name"
            />
          </div>

          <div>
            <label htmlFor="receipt_invoice" className="block text-sm font-medium text-gray-700 mb-1">
              Receipt/Invoice Number
            </label>
            <input
              type="text"
              id="receipt_invoice"
              name="receipt_invoice"
              value={formData.receipt_invoice}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Enter receipt or invoice number"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Enter any additional notes"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Budget Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
