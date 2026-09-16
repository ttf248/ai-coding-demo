import React from 'react';

const PostCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4 animate-pulse">
      {/* 图片骨架 */}
      <div className="w-full h-48 bg-gray-200"></div>
      
      {/* 内容骨架 */}
      <div className="p-3">
        {/* 标题骨架 */}
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* 底部信息骨架 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WaterfallSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col">
            <PostCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

export { PostCardSkeleton, WaterfallSkeleton };
