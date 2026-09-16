import React from 'react'

interface SkeletonLoaderProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: boolean
  avatar?: boolean
  lines?: number
  avatarSize?: 'sm' | 'md' | 'lg'
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  width,
  height,
  rounded = false,
  avatar = false,
  lines = 3,
  avatarSize = 'md',
}) => {
  const avatarSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const skeletonBaseClass = 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200'

  if (avatar) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className={`${skeletonBaseClass} ${avatarSizes[avatarSize]} rounded-full`} />
        <div className="flex-1">
          <div className={`${skeletonBaseClass} h-4 w-3/4 rounded mb-2`} />
          <div className={`${skeletonBaseClass} h-3 w-1/2 rounded`} />
        </div>
      </div>
    )
  }

  if (rounded) {
    return (
      <div
        className={`${skeletonBaseClass} ${className}`}
        style={{ width, height }}
      />
    )
  }

  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`${skeletonBaseClass} h-4 rounded mb-2 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  )
}

export default SkeletonLoader
