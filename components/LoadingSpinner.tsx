'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars'
  text?: string
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'spinner', 
  text,
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )
      
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`}></div>
        )
      
      case 'bars':
        return (
          <div className="flex space-x-1">
            <div className="w-1 h-6 bg-blue-600 animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-6 bg-blue-600 animate-pulse" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-6 bg-blue-600 animate-pulse" style={{ animationDelay: '300ms' }}></div>
            <div className="w-1 h-6 bg-blue-600 animate-pulse" style={{ animationDelay: '450ms' }}></div>
          </div>
        )
      
      default:
        return (
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-blue-600 border-t-transparent`}></div>
        )
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="animate-fadeIn">
        {renderSpinner()}
      </div>
      {text && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 animate-fadeIn animation-delay-300">
          {text}
        </p>
      )}
    </div>
  )
}