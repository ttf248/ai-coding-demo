import React, { useState, useCallback, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isActiveRef = useRef(false); // 跟踪是否正在进行下拉操作

  const PULL_THRESHOLD = 80;
  const MAX_PULL_DISTANCE = 120;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY > 0 || isRefreshing) return;
    
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    isActiveRef.current = true;
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (window.scrollY > 0 || isRefreshing || !isActiveRef.current) return;
    
    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;
    
    if (deltaY > 0) {
      e.preventDefault();
      const distance = Math.min(deltaY * 0.5, MAX_PULL_DISTANCE);
      setPullDistance(distance);
      setIsPulling(distance > PULL_THRESHOLD);
    } else {
      // 如果向上滑动，重置状态
      setPullDistance(0);
      setIsPulling(false);
    }
  }, [isRefreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (!isActiveRef.current) return;
    
    const shouldRefresh = pullDistance > PULL_THRESHOLD && !isRefreshing;
    
    if (shouldRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    // 重置所有状态
    setIsPulling(false);
    setPullDistance(0);
    isActiveRef.current = false;
  }, [pullDistance, isRefreshing, onRefresh]);

  // 处理触摸取消事件（比如快速滑动时系统可能取消触摸）
  const handleTouchCancel = useCallback(() => {
    setIsPulling(false);
    setPullDistance(0);
    isActiveRef.current = false;
  }, []);

  // 监听刷新状态变化，确保状态一致性
  useEffect(() => {
    if (isRefreshing) {
      setIsPulling(false);
      setPullDistance(0);
      isActiveRef.current = false;
    }
  }, [isRefreshing]);

  const refreshIndicatorTransform = `translateY(${Math.max(0, pullDistance - 40)}px)`;
  const contentTransform = `translateY(${pullDistance}px)`;

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {/* 刷新指示器 */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center h-16 -mt-16 z-10"
        style={{ transform: refreshIndicatorTransform }}
      >
        <div className="flex flex-col items-center space-y-1">
          <RefreshCw
            className={`h-5 w-5 text-primary transition-transform duration-200 ${
              isRefreshing ? 'animate-spin' : isPulling ? 'rotate-180' : ''
            }`}
          />
          <span className="text-xs text-gray-600">
            {isRefreshing ? '刷新中...' : isPulling ? '松开刷新' : '下拉刷新'}
          </span>
        </div>
      </div>

      {/* 内容区域 */}
      <div
        className="transition-transform duration-200 ease-out"
        style={{ transform: contentTransform }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
