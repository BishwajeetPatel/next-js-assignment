'use client'

import { useState, useEffect } from 'react'
import { Call, ApiResponse } from '../lib/types'
import { CallCard } from '../components/CallCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { BarChart3, TrendingUp, Users, Phone } from 'lucide-react'

// Simple animated counter since AnimatedCounter doesn't exist
const AnimatedCounter = ({ 
  end, 
  duration = 1500, 
  suffix = '' 
}: { 
  end: number
  duration?: number
  suffix?: string 
}) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count}{suffix}</span>
}

// Simple dashboard skeleton loader
const DashboardSkeleton = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 animate-pulse">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
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
      ))}
    </div>
  </>
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

export default function Dashboard() {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statsLoaded, setStatsLoaded] = useState(false)

  useEffect(() => {
    fetchCalls()
  }, [])

  const fetchCalls = async () => {
    try {
      // Add artificial delay to show loading animations
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const response = await fetch('/api/calls')
      const data: ApiResponse<Call[]> = await response.json()
      
      if (data.success) {
        setCalls(data.data)
        // Trigger stats animation after a short delay
        setTimeout(() => setStatsLoaded(true), 300)
      } else {
        setError(data.error || 'Failed to fetch calls')
      }
    } catch (err) {
      setError('Failed to fetch calls')
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    totalCalls: calls.length,
    avgDuration: calls.reduce((acc, call) => acc + call.duration, 0) / calls.length / 60,
    qualifiedRate: (calls.filter(call => call.outcome === 'qualified' || call.outcome === 'closed-won').length / calls.length) * 100,
    avgSentiment: calls.reduce((acc, call) => acc + call.sentimentScore, 0) / calls.length
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2 loading-skeleton"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-96 loading-skeleton"></div>
        </div>
        <DashboardSkeleton />
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <FadeInSection className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 animate-slideInDown">
            Sales Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 animate-slideInUp animation-delay-200">
            Overview of your sales call performance
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FadeInSection delay={0} className="stagger-item">
            <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 card-hover hover-lift">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg animate-float">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Calls</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {statsLoaded ? (
                      <AnimatedCounter end={stats.totalCalls} duration={1500} />
                    ) : (
                      <span className="inline-block w-8 h-6 bg-gray-200 dark:bg-gray-700 loading-skeleton"></span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={100} className="stagger-item">
            <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 card-hover hover-lift">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg animate-float animation-delay-200">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Duration</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {statsLoaded ? (
                      <AnimatedCounter 
                        end={isNaN(stats.avgDuration) ? 0 : Math.round(stats.avgDuration)} 
                        duration={1800} 
                        suffix="m" 
                      />
                    ) : (
                      <span className="inline-block w-12 h-6 bg-gray-200 dark:bg-gray-700 loading-skeleton"></span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={200} className="stagger-item">
            <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 card-hover hover-lift">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg animate-float animation-delay-300">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Qualified Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {statsLoaded ? (
                      <AnimatedCounter 
                        end={isNaN(stats.qualifiedRate) ? 0 : Math.round(stats.qualifiedRate)} 
                        duration={2000} 
                        suffix="%" 
                      />
                    ) : (
                      <span className="inline-block w-10 h-6 bg-gray-200 dark:bg-gray-700 loading-skeleton"></span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={300} className="stagger-item">
            <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 card-hover hover-lift">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg animate-float animation-delay-500">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Sentiment</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {statsLoaded ? (
                      <AnimatedCounter 
                        end={isNaN(stats.avgSentiment) ? 0 : Math.round(stats.avgSentiment * 100)} 
                        duration={2200} 
                        suffix="%" 
                      />
                    ) : (
                      <span className="inline-block w-10 h-6 bg-gray-200 dark:bg-gray-700 loading-skeleton"></span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>

        <FadeInSection delay={400} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 animate-slideInLeft">
            Recent Calls
          </h2>
          
          {error ? (
            <ErrorMessage message={error} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {calls.slice(0, 6).map((call, index) => (
                <FadeInSection key={call.id} delay={index * 100} direction="up">
                  <div className="animate-slideInUp stagger-item">
                    <CallCard call={call} />
                  </div>
                </FadeInSection>
              ))}
            </div>
          )}
        </FadeInSection>
      </div>
    </PageTransition>
  )
}