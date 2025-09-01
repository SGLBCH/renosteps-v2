'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import Sidebar from './Sidebar'
import DashboardHeader from './DashboardHeader'
import DashboardContent from './DashboardContent'

interface Project {
  id: string
  name: string
  start_date: string
  end_date: string
  status: string
}

export default function DashboardLayout() {
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching projects:', error)
        return
      }

      setProjects(data || [])
      
      // Auto-select the first project if available
      if (data && data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }, [user, selectedProjectId])

  // Fetch user's projects on component mount
  useEffect(() => {
    if (user) {
      fetchProjects()
    }
  }, [user, fetchProjects])

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId)
  }

  const handleProjectCreated = () => {
    fetchProjects() // Refresh projects list
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        user={user}
        onSignOut={handleSignOut}
        projects={projects}
        selectedProjectId={selectedProjectId}
        onProjectSelect={handleProjectSelect}
        onProjectCreated={handleProjectCreated}
      />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <DashboardHeader 
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          selectedProject={projects.find(p => p.id === selectedProjectId)}
        />
        <DashboardContent projectId={selectedProjectId || undefined} />
      </div>
    </div>
  )
}
