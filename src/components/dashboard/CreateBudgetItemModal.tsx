'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'

// Removed unused BudgetItem interface

interface CreateBudgetItemModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  onBudgetItemCreated: () => void
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

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const
const STATUSES = ['Pending', 'In Progress', 'Completed', 'Cancelled'] as const

export default function CreateBudgetItemModal({ isOpen, onClose, projectId, onBudgetItemCreated }: CreateBudgetItemModalProps) {
  const { user } = useAuth()
  const [isCreating, setIsCreating] = useState(false)
  
  // Form fields
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [allocatedAmount, setAllocatedAmount] = useState('')
  const [actualSpent, setActualSpent] = useState('')
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed' | 'Cancelled'>('Pending')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium')
  const [vendorContractor, setVendorContractor] = useState('')
  const [receiptInvoice, setReceiptInvoice] = useState('')
  const [notes, setNotes] = useState('')

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetForm()
    }
  }, [isOpen])

  const resetForm = () => {
    setCategory('')
    setDescription('')
    setAllocatedAmount('')
    setActualSpent('')
    setStatus('Pending')
    setDueDate('')
    setPriority('Medium')
    setVendorContractor('')
    setReceiptInvoice('')
    setNotes('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !category || !description.trim() || !allocatedAmount) {
      alert('Please fill in all required fields')
      return
    }

    // Validate amounts
    const allocated = parseFloat(allocatedAmount)
    const spent = actualSpent ? parseFloat(actualSpent) : 0
    
    if (allocated < 0 || spent < 0) {
      alert('Amounts cannot be negative')
      return
    }

    if (spent > allocated) {
      alert('Actual spent cannot exceed allocated amount')
      return
    }

    setIsCreating(true)
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('budget_items')
        .insert([
          {
            project_id: projectId,
            category,
            description: description.trim(),
            allocated_amount: allocated,
            actual_spent: spent,
            status,
            due_date: dueDate || null,
            priority,
            vendor_contractor: vendorContractor.trim() || null,
            receipt_invoice: receiptInvoice.trim() || null,
            notes: notes.trim() || null
          }
        ])

      if (error) {
        console.error('Error creating budget item:', error)
        alert(`Failed to create budget item: ${error.message || 'Unknown error'}`)
        return
      }

      // Success - reset form and close modal
      resetForm()
      onClose()
      onBudgetItemCreated()
      
      alert('Budget item created successfully!')
      
    } catch (error) {
      console.error('Error creating budget item:', error)
      alert('Failed to create budget item. Please try again.')
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
              Create New Budget Item
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
                  onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High' | 'Critical')}
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
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Enter budget item description"
                required
              />
            </div>

            {/* Amounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="allocatedAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Allocated Amount ($) *
                </label>
                <input
                  type="number"
                  id="allocatedAmount"
                  value={allocatedAmount}
                  onChange={(e) => setAllocatedAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label htmlFor="actualSpent" className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Spent ($)
                </label>
                <input
                  type="number"
                  id="actualSpent"
                  value={actualSpent}
                  onChange={(e) => setActualSpent(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Status and Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Pending' | 'In Progress' | 'Completed' | 'Cancelled')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  required
                >
                  {STATUSES.map((stat) => (
                    <option key={stat} value={stat}>{stat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Vendor and Receipt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="vendorContractor" className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor/Contractor
                </label>
                <input
                  type="text"
                  id="vendorContractor"
                  value={vendorContractor}
                  onChange={(e) => setVendorContractor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Enter vendor or contractor name"
                />
              </div>

              <div>
                <label htmlFor="receiptInvoice" className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt/Invoice Reference
                </label>
                <input
                  type="text"
                  id="receiptInvoice"
                  value={receiptInvoice}
                  onChange={(e) => setReceiptInvoice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Enter receipt or invoice number"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Additional notes or comments"
              />
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
                disabled={isCreating || !category || !description.trim() || !allocatedAmount}
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
                    Create Budget Item
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
