import React from 'react'

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'md',
  text,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-redbook/20 border-t-redbook rounded-full animate-spin`}
      />
      {text && (
        <span className={`text-gray-500 ${textSizeClasses[size]}`}>
          {text}
        </span>
      )}
    </div>
  )
}

export default LoadingIndicator
