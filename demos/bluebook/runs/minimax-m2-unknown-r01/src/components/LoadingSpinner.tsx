import React from 'react'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-redbook rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-redbook rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-redbook rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )
}

export default LoadingSpinner
