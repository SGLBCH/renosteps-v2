'use client'

import { useState } from 'react'
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import { CurrencyDollarIcon, TagIcon } from '@heroicons/react/24/solid'

interface InspirationPhoto {
  id: string
  photo_url: string
  photo_order: number
}

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

interface InspirationCardProps {
  inspiration: InspirationItem
  onEdit: () => void
  onDelete: () => void
}

export default function InspirationCard({ inspiration, onEdit, onDelete }: InspirationCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)

  const handlePhotoChange = (direction: 'next' | 'prev') => {
    if (inspiration.photos.length <= 1) return
    
    if (direction === 'next') {
      setCurrentPhotoIndex((prev) => 
        prev === inspiration.photos.length - 1 ? 0 : prev + 1
      )
    } else {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? inspiration.photos.length - 1 : prev - 1
      )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group">
        {/* Image Section */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {inspiration.photos.length > 0 ? (
            <>
              <img
                src={inspiration.photos[currentPhotoIndex].photo_url}
                alt={inspiration.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => setShowImageModal(true)}
              />
              
              {/* Photo Navigation */}
              {inspiration.photos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePhotoChange('prev')
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePhotoChange('next')
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Photo Counter */}
              {inspiration.photos.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                  {currentPhotoIndex + 1} / {inspiration.photos.length}
                </div>
              )}
              
              {/* View Full Image Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowImageModal(true)
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="View full image"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Title and Actions */}
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
              {inspiration.title}
            </h3>
            <div className="flex space-x-1 ml-2">
              <button
                onClick={onEdit}
                className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                title="Edit"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                title="Delete"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-3">
            {truncateText(inspiration.description, 120)}
          </p>

          {/* Price */}
          {inspiration.price && (
            <div className="flex items-center text-sm text-gray-700">
              <CurrencyDollarIcon className="w-4 h-4 mr-1 text-green-600" />
              <span className="font-medium">${inspiration.price.toLocaleString()}</span>
            </div>
          )}

          {/* Category and Tags */}
          <div className="space-y-2">
            {inspiration.category && (
              <div className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                {inspiration.category}
              </div>
            )}
            
            {inspiration.tags && inspiration.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {inspiration.tags.slice(0, 3).map((tag, index) => (
                  <div key={index} className="flex items-center bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    <TagIcon className="w-3 h-3 mr-1" />
                    {tag}
                  </div>
                ))}
                {inspiration.tags.length > 3 && (
                  <div className="text-xs text-gray-500 flex items-center">
                    +{inspiration.tags.length - 3} more
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Date */}
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            Added {formatDate(inspiration.created_at)}
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {showImageModal && inspiration.photos.length > 0 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img
              src={inspiration.photos[currentPhotoIndex].photo_url}
              alt={inspiration.title}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Navigation in Modal */}
            {inspiration.photos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePhotoChange('prev')
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePhotoChange('next')
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Photo Counter in Modal */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">
                  {currentPhotoIndex + 1} / {inspiration.photos.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
