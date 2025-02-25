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
  { key: 'SH', name: '沪深' },
  { key: 'HK', name: '港股' },
  { key: 'US', name: '美股' },
];

const App: React.FC = () => {
  const [activeMarket, setActiveMarket] = useState<string>('SH');
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const { data: stocks, isError } = useQuery(
    ['stocks', activeMarket],
    async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/stocks`, {
          params: { market: activeMarket }
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
            children: <StockList stocks={stocks || []} isError={isError} market={market.key} />,
          }))}
        />
      </Content>
    </Layout>
  );
};

export default App;