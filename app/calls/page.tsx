'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X, Plus, Loader2 } from 'lucide-react'
import { Call, ApiResponse } from '../../lib/types'
import { CallCard } from '../../components/CallCard'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { ErrorMessage } from '../../components/ErrorMessage'
import  AddCallForm from '../../components/AddCallForm'

// Simple skeleton loader component since SkeletonLoader doesn't exist
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
    </div>
  </div>
)

// Simple fade in wrapper since FadeInSection doesn't exist
const FadeInSection = ({ 
  children, 
  delay = 0, 
  direction = 'up', 
  className = '' 
}: { 
  children: React.ReactNode
  delay?: number
  direction?: string
  className?: string 
}) => (
  <div 
    className={`animate-fadeIn ${className}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
)

// Simple page transition wrapper since PageTransition doesn't exist
const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <div className="animate-fadeIn">
    {children}
  </div>
)

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([])
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddingCall, setIsAddingCall] = useState(false)

  useEffect(() => {
    fetchCalls()
  }, [])

  useEffect(() => {
    filterCalls()
  }, [calls, searchTerm, statusFilter])

  const fetchCalls = async () => {
    try {
      // Add delay to show loading animation
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const response = await fetch('/api/calls')
      const data: ApiResponse<Call[]> = await response.json()
      
      if (data.success) {
        setCalls(data.data)
      } else {
        setError(data.error || 'Failed to fetch calls')
      }
    } catch (err) {
      setError('Failed to fetch calls')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCall = async (newCallData: Omit<Call, 'id'>) => {
    setIsAddingCall(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newCall: Call = {
      ...newCallData,
      id: `call_${Date.now()}`
    }
    
    setCalls(prevCalls => [newCall, ...prevCalls])
    setIsAddingCall(false)
  }

  const filterCalls = async () => {
    setSearching(true)
    
    // Add small delay for search animation
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let filtered = calls

    if (searchTerm) {
      filtered = filtered.filter(call =>
        call.prospectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(call => call.outcome === statusFilter)
    }

    setFilteredCalls(filtered)
    setSearching(false)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setStatusFilter('all')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 loading-skeleton"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-64 loading-skeleton"></div>
            </div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 loading-skeleton"></div>
          </div>
        </div>
        
        {/* Search/filter skeleton */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1 loading-skeleton"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40 loading-skeleton"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        {/* Header with animation */}
        <FadeInSection className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white animate-slideInLeft">
                All Calls
              </h1>
              <p className="text-gray-600 dark:text-gray-300 animate-slideInLeft animation-delay-200">
                Manage and review your sales calls
              </p>
            </div>
            
            <div className="animate-slideInRight">
              <AddCallForm 
                onAddCall={handleAddCall}
                isLoading={isAddingCall}
              />
            </div>
          </div>
        </FadeInSection>

        {/* Search and Filter with animations */}
        <FadeInSection delay={200} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search input with loading state */}
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                              text-gray-400 h-4 w-4 transition-colors duration-200
                              group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Search calls by name or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 
                         rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 form-input
                         hover:border-gray-400 dark:hover:border-gray-500"
              />
              
              {/* Loading indicator */}
              {searching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                </div>
              )}
              
              {/* Clear button */}
              {searchTerm && !searching && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2
                           text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                           transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Filter dropdown */}
            <div className="relative group">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 
                              text-gray-400 h-4 w-4 transition-colors duration-200
                              group-focus-within:text-blue-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 
                         rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 form-input min-w-[160px]
                         hover:border-gray-400 dark:hover:border-gray-500"
              >
                <option value="all">All Outcomes</option>
                <option value="qualified">Qualified</option>
                <option value="not-qualified">Not Qualified</option>
                <option value="follow-up">Follow Up</option>
                <option value="closed-won">Closed Won</option>
                <option value="closed-lost">Closed Lost</option>
              </select>
            </div>
          </div>

          {/* Active filters display */}
          {(searchTerm || statusFilter !== 'all') && (
            <div className="mt-4 flex items-center gap-2 animate-slideInUp">
              <span className="text-sm text-gray-600 dark:text-gray-300">Active filters:</span>
              {searchTerm && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 
                               text-sm rounded-full flex items-center gap-1 animate-scaleIn">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 
                               text-sm rounded-full flex items-center gap-1 animate-scaleIn animation-delay-100">
                  Status: {statusFilter.replace('-', ' ')}
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="hover:text-green-900 dark:hover:text-green-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearSearch}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 
                         underline animate-fadeIn"
              >
                Clear all
              </button>
            </div>
          )}
        </FadeInSection>

        {error ? (
          <FadeInSection delay={300}>
            <ErrorMessage message={error} />
          </FadeInSection>
        ) : (
          <>
            {/* Results counter with animation */}
            <FadeInSection delay={300} className="mb-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-300 animate-fadeIn">
                  {searching ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Searching...
                    </span>
                  ) : (
                    `Showing ${filteredCalls.length} of ${calls.length} calls`
                  )}
                </p>
                
                {filteredCalls.length > 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 animate-fadeIn animation-delay-200">
                    Found {filteredCalls.length} result{filteredCalls.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </FadeInSection>
            
            {/* Cards grid with staggered animations */}
            {filteredCalls.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCalls.map((call, index) => (
                  <FadeInSection 
                    key={call.id} 
                    delay={400 + (index * 50)}
                    direction="up"
                  >
                    <CallCard call={call} index={index} />
                  </FadeInSection>
                ))}
              </div>
            ) : (
              <FadeInSection delay={400}>
                <div className="text-center py-16 animate-fadeIn">
                  <div className="text-gray-400 dark:text-gray-500 mb-6">
                    <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full 
                                  flex items-center justify-center mb-4 animate-pulse">
                      <Search className="h-12 w-12" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No calls found
                    </h3>
                    <p className="text-sm max-w-sm mx-auto">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                        : 'Get started by adding your first call to track your sales performance.'
                      }
                    </p>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    {(searchTerm || statusFilter !== 'all') && (
                      <button
                        onClick={clearSearch}
                        className="btn-animated px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                                 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                      >
                        Clear filters
                      </button>
                    )}
                    
                    {(!searchTerm && statusFilter === 'all') && (
                      <AddCallForm 
                        onAddCall={handleAddCall}
                        isLoading={isAddingCall}
                      />
                    )}
                  </div>
                </div>
              </FadeInSection>
            )}
          </>
        )}
      </div>
    </PageTransition>
  )
}