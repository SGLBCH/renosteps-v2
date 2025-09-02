'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { generateStorageFileName, logFileNameCodePoints } from '@/lib/fileUtils'
import { XMarkIcon, PhotoIcon, XMarkIcon as XIcon } from '@heroicons/react/24/outline'

interface CreateInspirationModalProps {
  isOpen: boolean
  onClose: () => void
  projectId?: string
  onInspirationCreated: () => void
}

const CATEGORIES = [
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

export default function CreateInspirationModal({ 
  isOpen, 
  onClose, 
  projectId, 
  onInspirationCreated 
}: CreateInspirationModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    tags: [] as string[],
    newTag: ''
  })

  const [photos, setPhotos] = useState<File[]>([])
  const [photoUrls, setPhotoUrls] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }))
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    )

    if (photos.length + validFiles.length > 5) {
      setError('Maximum 5 photos allowed')
      return
    }

    setPhotos(prev => [...prev, ...validFiles])
    setError(null)

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhotoUrls(prev => [...prev, e.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
    setPhotoUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required')
      return
    }

    // Photos are now optional - no validation needed

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Create inspiration item
      const { data: inspirationItem, error: inspirationError } = await supabase
        .from('inspiration_items')
        .insert({
          user_id: user.id,
          project_id: projectId || null,
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: formData.price ? parseFloat(formData.price) : null,
          category: formData.category || null,
          tags: formData.tags.length > 0 ? formData.tags : null
        })
        .select()
        .single()

      if (inspirationError) {
        console.error('Error creating inspiration item:', inspirationError)
        setError('Failed to create inspiration item')
        return
      }

      // Upload photos to Supabase Storage (only if photos exist)
      if (photos.length > 0) {
        const photoPromises = photos.map(async (photo, index) => {
          // Debug: log code points voor problematische bestandsnamen
          logFileNameCodePoints(photo.name)
          
          const fileName = generateStorageFileName(inspirationItem.id, photo.name, index)
          
          // Correcte Supabase upload call met contentType
          const { error: uploadError } = await supabase.storage
            .from('inspiration-photos')
            .upload(fileName, photo, {
              contentType: photo.type,
              cacheControl: '3600',
              upsert: false // Don't overwrite existing files
            })

          if (uploadError) {
            console.error('Error uploading photo:', uploadError)
            throw uploadError
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('inspiration-photos')
            .getPublicUrl(fileName)

          return {
            inspiration_id: inspirationItem.id,
            photo_url: publicUrl,
            photo_order: index
          }
        })

        const photoData = await Promise.all(photoPromises)

        // Insert photo records
        const { error: photosError } = await supabase
          .from('inspiration_photos')
          .insert(photoData)

        if (photosError) {
          console.error('Error saving photo records:', photosError)
          setError('Failed to save photos')
          return
        }
      }

      onInspirationCreated()
      onClose()
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        tags: [],
        newTag: ''
      })
      setPhotos([])
      setPhotoUrls([])
    } catch (error) {
      console.error('Error creating inspiration item:', error)
      setError('Failed to create inspiration item')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Add New Inspiration</h2>
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
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Enter inspiration title"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Describe your inspiration idea"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                name="newTag"
                value={formData.newTag}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos (optional, up to 5)
            </label>
            
            {/* Photo Upload Area */}
            {photos.length < 5 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="text-sm text-gray-600 mb-2">
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500 font-medium">Click to upload</span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB each</p>
                <input
                  id="photo-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Photo Previews */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photoUrls[index]}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              {loading ? 'Creating...' : 'Create Inspiration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
