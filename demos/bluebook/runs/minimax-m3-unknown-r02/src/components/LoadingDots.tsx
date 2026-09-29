import React from 'react';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-1.5" aria-label="加载中">
      <span className="block h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.32s]" />
      <span className="block h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.16s]" />
      <span className="block h-2 w-2 rounded-full bg-primary animate-bounce" />
    </div>
  );
};

export default LoadingDots;
