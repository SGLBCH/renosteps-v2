'use client'

import { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto pt-8 px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center transition-colors ${
                activeTab === 'login'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center transition-colors ${
                activeTab === 'register'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
    </div>
  )
}
