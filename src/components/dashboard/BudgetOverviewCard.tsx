'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
// Removed unused CurrencyDollarIcon import

interface BudgetOverviewCardProps {
  projectId: string
}

interface BudgetSummary {
  totalAllocated: number
  totalSpent: number
  remaining: number
  percentageUsed: number
  status: 'On Track' | 'Near Limit' | 'Over Budget'
}

export default function BudgetOverviewCard({ projectId }: BudgetOverviewCardProps) {
  const { user } = useAuth()
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary>({
    totalAllocated: 0,
    totalSpent: 0,
    remaining: 0,
    percentageUsed: 0,
    status: 'On Track'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (projectId) {
      fetchBudgetSummary()
    }
  }, [projectId, fetchBudgetSummary])

  const fetchBudgetSummary = useCallback(async () => {
    if (!user || !projectId) return

    setLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('budget_items')
        .select('allocated_amount, actual_spent')
        .eq('project_id', projectId)

      if (error) {
        console.error('Error fetching budget summary:', error)
        return
      }

      const totalAllocated = data?.reduce((sum, item) => sum + (item.allocated_amount || 0), 0) || 0
      const totalSpent = data?.reduce((sum, item) => sum + (item.actual_spent || 0), 0) || 0
      const remaining = totalAllocated - totalSpent
      const percentageUsed = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0

      let status: 'On Track' | 'Near Limit' | 'Over Budget' = 'On Track'
      if (percentageUsed >= 100) {
        status = 'Over Budget'
      } else if (percentageUsed >= 80) {
        status = 'Near Limit'
      }

      setBudgetSummary({
        totalAllocated,
        totalSpent,
        remaining,
        percentageUsed,
        status
      })
    } catch (error) {
      console.error('Error fetching budget summary:', error)
    } finally {
      setLoading(false)
    }
  }, [user, projectId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Over Budget':
        return 'text-red-600'
      case 'Near Limit':
        return 'text-yellow-600'
      case 'On Track':
      default:
        return 'text-green-600'
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    if (percentage >= 50) return 'bg-blue-500'
    return 'bg-green-500'
  }

  if (loading) {
    return (
      <div className="px-4 py-3 border-b border-gray-700">
        <div className="text-sm text-gray-300 mb-2">Budget Overview</div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-3 border-b border-gray-700">
      <div className="text-sm text-gray-300 mb-2">Budget Overview</div>
      
      {/* Total Budget */}
      <div className="text-sm text-white font-medium mb-1">
        ${budgetSummary.totalAllocated.toLocaleString()}
      </div>
      
      {/* Total Spent */}
      <div className="text-xs text-gray-400 mb-1">
        Spent: ${budgetSummary.totalSpent.toLocaleString()}
      </div>
      
      {/* Remaining */}
      <div className="text-xs text-gray-400 mb-2">
        Remaining: ${budgetSummary.remaining.toLocaleString()}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(budgetSummary.percentageUsed)}`}
          style={{ width: `${Math.min(budgetSummary.percentageUsed, 100)}%` }}
        ></div>
      </div>
      
      {/* Percentage and Status */}
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-400">
          {budgetSummary.percentageUsed.toFixed(1)}% Used
        </span>
        <span className={`font-medium ${getStatusColor(budgetSummary.status)}`}>
          {budgetSummary.status}
        </span>
      </div>
    </div>
  )
}
