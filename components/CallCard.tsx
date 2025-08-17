import Link from 'next/link'
import { Clock, TrendingUp, MessageSquare, ArrowRight } from 'lucide-react'
import { Call } from '../lib/types'
import { formatDuration, formatDate, getOutcomeColor, cn } from '../lib/utils'
import { useState } from 'react'

interface CallCardProps {
  call: Call
  index?: number
}

export function CallCard({ call, index = 0 }: CallCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/calls/${call.id}`} className="block group">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 
                   transition-all duration-300 ease-out transform cursor-pointer
                   hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-700
                   hover:bg-gradient-to-br hover:from-white hover:to-blue-50 
                   dark:hover:from-gray-800 dark:hover:to-gray-700
                   animate-fadeIn"
        style={{ animationDelay: `${index * 100}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header with prospect name and outcome */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white 
                         group-hover:text-blue-600 dark:group-hover:text-blue-400 
                         transition-colors duration-200">
              {call.prospectName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 
                        transform transition-all duration-200
                        group-hover:translate-x-1">
              {formatDate(call.date)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 transform",
              "group-hover:scale-105",
              getOutcomeColor(call.outcome)
            )}>
              {call.outcome.replace('-', ' ')}
            </span>
            <ArrowRight className={cn(
              "h-4 w-4 text-gray-400 transition-all duration-200 transform",
              isHovered ? "translate-x-1 text-blue-500" : "translate-x-0"
            )} />
          </div>
        </div>

        {/* Metrics grid with animated icons */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2 group/metric">
            <div className="p-1 rounded transition-colors duration-200 
                          group-hover/metric:bg-blue-100 dark:group-hover/metric:bg-blue-900">
              <Clock className="h-4 w-4 text-gray-400 group-hover/metric:text-blue-500 
                              transition-colors duration-200" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {formatDuration(call.duration)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 group/metric">
            <div className="p-1 rounded transition-colors duration-200 
                          group-hover/metric:bg-green-100 dark:group-hover/metric:bg-green-900">
              <TrendingUp className="h-4 w-4 text-gray-400 group-hover/metric:text-green-500 
                                   transition-colors duration-200" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {Math.round(call.talkTimeRatio * 100)}%
            </span>
          </div>
          
          <div className="flex items-center space-x-2 group/metric">
            <div className="p-1 rounded transition-colors duration-200 
                          group-hover/metric:bg-purple-100 dark:group-hover/metric:bg-purple-900">
              <MessageSquare className="h-4 w-4 text-gray-400 group-hover/metric:text-purple-500 
                                      transition-colors duration-200" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {call.questionsAsked}
            </span>
          </div>
        </div>

        {/* Notes section with fade-in animation */}
        {call.notes && (
          <div className="mb-4 transform transition-all duration-200 
                        group-hover:translate-x-1">
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 
                        group-hover:text-gray-700 dark:group-hover:text-gray-200">
              {call.notes}
            </p>
          </div>
        )}

        {/* Tags with stagger animation */}
        {call.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {call.tags.map((tag, tagIndex) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 
                         text-blue-800 dark:text-blue-200 text-xs rounded
                         transition-all duration-200 transform
                         hover:bg-blue-200 dark:hover:bg-blue-800
                         hover:scale-105 animate-fadeIn"
                style={{ animationDelay: `${(index * 100) + (tagIndex * 50)}ms` }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Hover glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300",
          "bg-gradient-to-r from-blue-400/10 to-purple-400/10",
          isHovered && "opacity-100"
        )}></div>
      </div>
    </Link>
  )
}