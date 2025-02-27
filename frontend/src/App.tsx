import React, { useState } from 'react';
import { Layout, Tabs, message, Input } from 'antd';
import { useQuery } from 'react-query';
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';
import StockList from './components/StockList';
import './App.css';
import ThemeSwitch from './components/ThemeSwitch';

const { Header, Content } = Layout;

interface Market {
  key: string;
  name: string;
}

const markets: Market[] = [
  { key: 'A', name: '沪深京' },
  { key: 'HK', name: '港股' },
  { key: 'US', name: '美股' },
];

const App: React.FC = () => {
  const [activeMarket, setActiveMarket] = useState<string>('A');
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const { data: stocksData, isError } = useQuery(
    ['stocks', activeMarket, currentPage, pageSize],
    async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stocks`, {
          params: { 
            market: activeMarket,
            page: currentPage,
            pageSize: pageSize
          }
        });
        console.log('获取股票数据成功:', response.data);
        return response.data;
      } catch (error) {
        console.error('获取股票数据失败:', error);
        message.error('获取股票数据失败，请检查网络连接');
        throw error;
      }
    },
    {
      refetchInterval: 5000, // 每5秒刷新一次数据
    }
  );

  const handleMarketChange = (market: string) => {
    console.log('切换市场:', market);
    setActiveMarket(market);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Layout className={`app-container ${!isDarkMode ? 'light-theme' : ''}`}>
      <Header className="app-header">
        <h1>自选股票</h1>
        <div className="header-search">
          {isSearchVisible ? (
            <Input
              placeholder="输入股票代码或名称"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onBlur={() => setIsSearchVisible(false)}
              autoFocus
            />
          ) : (
            <SearchOutlined
              className="search-icon"
              onClick={() => setIsSearchVisible(true)}
            />
          )}
        </div>
        <ThemeSwitch isDarkMode={isDarkMode} onToggle={toggleTheme} />
      </Header>
      <Content className="app-content">
        <Tabs
          activeKey={activeMarket}
          onChange={handleMarketChange}
          items={markets.map((market) => ({
            key: market.key,
            label: market.name,
            children: <StockList 
              stocks={stocksData?.data || []} 
              isError={isError} 
              market={market.key}
              total={stocksData?.total || 0}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />,
          }))}
        />
      </Content>
    </Layout>
  );
};

export default App;