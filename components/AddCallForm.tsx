import React, { useState } from 'react'
import { Plus, X, Loader2, Check } from 'lucide-react'

// Mock Call type for debugging
interface Call {
  id: string
  prospectName: string
  date: string
  duration: number
  status: 'completed' | 'scheduled' | 'cancelled'
  outcome: 'qualified' | 'not-qualified' | 'follow-up' | 'closed-won' | 'closed-lost'
  talkTimeRatio: number
  questionsAsked: number
  sentimentScore: number
  notes: string
  tags: string[]
}

interface AddCallFormProps {
  onAddCall: (call: Omit<Call, 'id'>) => void
  isLoading?: boolean
}

function AddCallForm({ onAddCall, isLoading = false }: AddCallFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    prospectName: '',
    date: '',
    duration: '',
    status: 'completed' as const,
    outcome: 'follow-up' as const,
    talkTimeRatio: '',
    questionsAsked: '',
    sentimentScore: '',
    notes: '',
    tags: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Add console log to debug
  console.log('AddCallForm render - isOpen:', isOpen)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.prospectName.trim()) {
      newErrors.prospectName = 'Prospect name is required'
    }
    
    if (formData.duration && (parseInt(formData.duration) < 0)) {
      newErrors.duration = 'Duration must be positive'
    }
    
    if (formData.talkTimeRatio && (parseFloat(formData.talkTimeRatio) < 0 || parseFloat(formData.talkTimeRatio) > 1)) {
      newErrors.talkTimeRatio = 'Talk time ratio must be between 0 and 1'
    }
    
    if (formData.sentimentScore && (parseFloat(formData.sentimentScore) < 0 || parseFloat(formData.sentimentScore) > 1)) {
      newErrors.sentimentScore = 'Sentiment score must be between 0 and 1'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form submitted!')
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    const newCall: Omit<Call, 'id'> = {
      prospectName: formData.prospectName.trim(),
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      duration: parseInt(formData.duration) || 0,
      status: formData.status,
      outcome: formData.outcome,
      talkTimeRatio: parseFloat(formData.talkTimeRatio) || 0,
      questionsAsked: parseInt(formData.questionsAsked) || 0,
      sentimentScore: parseFloat(formData.sentimentScore) || 0,
      notes: formData.notes.trim(),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    onAddCall(newCall)
    
    setIsSuccess(true)
    
    // Reset form after success animation
    setTimeout(() => {
      resetForm()
      setIsSubmitting(false)
      setIsSuccess(false)
      setIsOpen(false)
    }, 1500)
  }

  const resetForm = () => {
    setFormData({
      prospectName: '',
      date: '',
      duration: '',
      status: 'completed',
      outcome: 'follow-up',
      talkTimeRatio: '',
      questionsAsked: '',
      sentimentScore: '',
      notes: '',
      tags: ''
    })
    setErrors({})
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setIsOpen(false)
      resetForm()
    }
  }

  const handleOpenClick = () => {
    console.log('Button clicked! Current isOpen:', isOpen)
    setIsOpen(true)
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleOpenClick}
        disabled={isLoading}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg 
                 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105
                 disabled:opacity-50 disabled:cursor-not-allowed
                 shadow-lg hover:shadow-xl"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        <span>Add New Call</span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] 
                    overflow-hidden transform">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Call</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Record details of your sales call
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 
                     transition-colors duration-200 p-1 rounded-lg hover:bg-white/50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prospect Name *
                  </label>
                  <input
                    type="text"
                    name="prospectName"
                    value={formData.prospectName}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                              focus:ring-2 focus:border-transparent transition-all duration-200
                              ${errors.prospectName 
                                ? 'border-red-300 focus:ring-red-500' 
                                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                              }`}
                    placeholder="Enter prospect name"
                  />
                  {errors.prospectName && (
                    <p className="text-red-500 text-xs mt-1">{errors.prospectName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Call Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">
                Call Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="0"
                    className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                              focus:ring-2 focus:border-transparent transition-all duration-200
                              ${errors.duration 
                                ? 'border-red-300 focus:ring-red-500' 
                                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                              }`}
                    placeholder="e.g. 1800"
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200"
                  >
                    <option value="completed">Completed</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Outcome
                  </label>
                  <select
                    name="outcome"
                    value={formData.outcome}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200"
                  >
                    <option value="qualified">Qualified</option>
                    <option value="not-qualified">Not Qualified</option>
                    <option value="follow-up">Follow Up</option>
                    <option value="closed-won">Closed Won</option>
                    <option value="closed-lost">Closed Lost</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">
                Additional Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Call Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200 resize-none"
                  placeholder="Add any relevant notes about the call..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 
                       rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.prospectName.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-all duration-200 transform hover:scale-105 disabled:opacity-50 
                       disabled:cursor-not-allowed disabled:hover:scale-100
                       flex items-center space-x-2 min-w-[120px] justify-center"
            >
              {isSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Success!</span>
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add Call</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success overlay */}
        {isSuccess && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-95 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Call Added Successfully!</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your new call has been recorded and added to the dashboard.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Test component to demonstrate the issue and solution
export default function TestAddCallForm() {
  const [calls, setCalls] = useState<Call[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddCall = (newCallData: Omit<Call, 'id'>) => {
    const newCall: Call = {
      ...newCallData,
      id: `call_${Date.now()}`
    }
    setCalls(prev => [newCall, ...prev])
    console.log('Call added:', newCall)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Debug Add Call Form
        </h1>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Click the button below to test the form modal:
          </p>
          <AddCallForm onAddCall={handleAddCall} isLoading={isLoading} />
        </div>

        {calls.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Added Calls ({calls.length})
            </h2>
            <div className="space-y-4">
              {calls.map(call => (
                <div key={call.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">{call.prospectName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Status: {call.status} | Outcome: {call.outcome}
                  </p>
                  {call.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      Notes: {call.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}