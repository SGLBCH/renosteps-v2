'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { PlusIcon } from '@heroicons/react/24/outline'
import CreateInspirationModal from './CreateInspirationModal'
import EditInspirationModal from './EditInspirationModal'
import InspirationCard from './InspirationCard'
import InspirationFilters from './InspirationFilters'

interface InspirationItem {
  id: string
  title: string
  description: string
  price?: number
  category?: string
  tags?: string[]
  created_at: string
  updated_at: string
  photos: InspirationPhoto[]
}

interface InspirationPhoto {
  id: string
  photo_url: string
  photo_order: number
}

interface InspirationManagerProps {
  projectId?: string
}

const CATEGORIES = [
  'All',
  'Kitchen',
  'Bathroom',
  'Living Room',
  'Bedroom',
  'Exterior',
  'Materials',
  'Furniture',
  'Lighting',
  'Color Schemes',
  'Other'
]

export default function InspirationManager({ projectId }: InspirationManagerProps) {
  const { user } = useAuth()
  const [inspirationItems, setInspirationItems] = useState<InspirationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedInspiration, setSelectedInspiration] = useState<InspirationItem | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 })
  const [sortBy, setSortBy] = useState<'created_at' | 'updated_at' | 'title' | 'price' | 'category'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchInspirationItems = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      let query = supabase
        .from('inspiration_items')
        .select(`
          *,
          photos:inspiration_photos(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching inspiration items:', error)
        setError('Failed to load inspiration items')
        return
      }

      // Transform the data to match our interface
      const transformedData = data?.map(item => ({
        ...item,
        photos: (item.photos || []).sort((a: { photo_order: number }, b: { photo_order: number }) => a.photo_order - b.photo_order)
      })) || []

      setInspirationItems(transformedData)
    } catch (error) {
      console.error('Error fetching inspiration items:', error)
      setError('Failed to load inspiration items')
    } finally {
      setLoading(false)
    }
  }, [user, projectId])

  useEffect(() => {
    fetchInspirationItems()
  }, [fetchInspirationItems])

  const handleInspirationCreated = () => {
    fetchInspirationItems()
  }

  const handleEditInspiration = (inspiration: InspirationItem) => {
    setSelectedInspiration(inspiration)
    setShowEditModal(true)
  }

  const handleInspirationUpdated = () => {
    fetchInspirationItems()
  }

  const handleDeleteInspiration = async (inspirationId: string) => {
    if (!confirm('Are you sure you want to delete this inspiration item?')) return

    try {
      const supabase = createClient()
      
      // Delete photos first
      const { error: photosError } = await supabase
        .from('inspiration_photos')
        .delete()
        .eq('inspiration_id', inspirationId)

      if (photosError) {
        console.error('Error deleting photos:', photosError)
      }

      // Delete the inspiration item
      const { error } = await supabase
        .from('inspiration_items')
        .delete()
        .eq('id', inspirationId)

      if (error) {
        console.error('Error deleting inspiration item:', error)
        alert('Failed to delete inspiration item')
        return
      }

      // Remove item from local state
      setInspirationItems(inspirationItems.filter(item => item.id !== inspirationId))
      alert('Inspiration item deleted successfully')
    } catch (error) {
      console.error('Error deleting inspiration item:', error)
      alert('Failed to delete inspiration item')
    }
  }

  // Filter and sort inspiration items
  const filteredAndSortedItems = inspirationItems
    .filter(item => {
      // Search filter
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false
      }

      // Tags filter
      if (selectedTags.length > 0 && (!item.tags || !selectedTags.some(tag => item.tags?.includes(tag)))) {
        return false
      }

      // Price range filter
      if (item.price !== null && item.price !== undefined) {
        if (item.price < priceRange.min || item.price > priceRange.max) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      let aValue: string | number | undefined = a[sortBy]
      let bValue: string | number | undefined = b[sortBy]

      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue as string).getTime()
        bValue = new Date(bValue as string).getTime()
      }

      if (sortOrder === 'asc') {
        return (aValue || 0) > (bValue || 0) ? 1 : -1
      } else {
        return (aValue || 0) < (bValue || 0) ? 1 : -1
      }
    })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Inspiration</h2>
          <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading inspiration</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={fetchInspirationItems}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Inspiration button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Inspiration</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Inspiration
        </button>
      </div>

      {/* Filters */}
      <InspirationFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        categories={CATEGORIES}
        allTags={Array.from(new Set(inspirationItems.flatMap(item => item.tags || [])))}
      />

      {/* Inspiration Items Grid */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No inspiration found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedCategory !== 'All' || selectedTags.length > 0
              ? `No inspiration items found with the selected filters.`
              : "Get started by adding your first inspiration item."
            }
          </p>
          {(searchQuery || selectedCategory !== 'All' || selectedTags.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setSelectedTags([])
                setPriceRange({ min: 0, max: 10000 })
              }}
              className="text-black hover:text-gray-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedItems.map((item) => (
            <InspirationCard
              key={item.id}
              inspiration={item}
              onEdit={() => handleEditInspiration(item)}
              onDelete={() => handleDeleteInspiration(item.id)}
            />
          ))}
        </div>
      )}

      {/* Create Inspiration Modal */}
      <CreateInspirationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        projectId={projectId}
        onInspirationCreated={handleInspirationCreated}
      />

      {/* Edit Inspiration Modal */}
      <EditInspirationModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedInspiration(null)
        }}
        inspiration={selectedInspiration}
        onInspirationUpdated={handleInspirationUpdated}
      />
    </div>
  )
}
