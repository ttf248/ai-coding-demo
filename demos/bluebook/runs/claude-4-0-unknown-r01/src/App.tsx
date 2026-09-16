import React from 'react';
import Header from './components/Header';
import WaterfallGrid from './components/WaterfallGrid';
import PullToRefresh from './components/PullToRefresh';
import { usePostStore } from './store/postStore';
import './index.css';

const App: React.FC = () => {
  const { refreshPosts } = usePostStore();

  return (
    <div className="min-h-screen bg-background">
      {/* 头部 */}
      <Header />
      
      {/* 主内容区域 */}
      <main className="pb-safe">
        <PullToRefresh onRefresh={refreshPosts}>
          <WaterfallGrid />
        </PullToRefresh>
      </main>
    </div>
  );
};

export default App;
