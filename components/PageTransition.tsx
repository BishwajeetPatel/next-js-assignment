'use client'

import { ReactNode, useEffect, useState } from 'react'

export function PageTransition({ children, className = '' }: { children: ReactNode, className?: string }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className={`transform transition-all duration-500 ease-out ${
      isVisible 
        ? 'translate-y-0 opacity-100' 
        : 'translate-y-4 opacity-0'
    } ${className}`}>
      {children}
    </div>
  )
}
