export function SkeletonLoader({ 
    lines = 3, 
    className = '', 
    variant = 'card' 
  }: { 
    lines?: number
    className?: string
    variant?: 'card' | 'list' | 'table' | 'dashboard'
  }) {
    if (variant === 'card') {
      return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 animate-pulse ${className}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-32"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-md w-24"></div>
            </div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <div 
                key={i} 
                className={`h-3 bg-gray-200 dark:bg-gray-700 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
              ></div>
            ))}
          </div>
        </div>
      )
    }
  
    if (variant === 'dashboard') {
      return (
        <div className={`space-y-6 ${className}`}>
          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 animate-pulse">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="ml-4 space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Cards grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonLoader key={i} variant="card" />
            ))}
          </div>
        </div>
      )
    }
  
    // Default list variant
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i} 
            className={`h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
          ></div>
        ))}
      </div>
    )
  }