import React from 'react';
import { SearchBar } from './SearchBar';
import { WaterfallGrid } from './WaterfallGrid';
import { useAppStore } from '../store';

export const Layout: React.FC = () => {
  const refreshPosts = useAppStore((state) => state.refreshPosts);

  const handleSearch = (query: string) => {
    console.log('搜索:', query);
  };

  const handlePublish = () => {
    alert('发布功能开发中...');
  };

  const handleRefresh = () => {
    refreshPosts();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SearchBar onSearch={handleSearch} onPublish={handlePublish} />
      <WaterfallGrid onRefresh={handleRefresh} />
    </div>
  );
};
