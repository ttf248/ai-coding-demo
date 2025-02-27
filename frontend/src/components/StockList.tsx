import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Space, message, Dropdown, Tooltip, Pagination } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, MoreOutlined, BarChartOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface PriceHistory {
  id: number;
  stockId: string;
  price: number;
  timestamp: string;
}

interface Stock {
  id: string;
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  updatedAt?: string;
  priceHistory: PriceHistory[];
}

interface StockListProps {
  stocks: Stock[];
  isError: boolean;
  market: string;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
}

const StockList: React.FC<StockListProps> = ({ stocks, isError, market, total, currentPage, pageSize, onPageChange, onPageSizeChange, isLoading }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [highlightedStocks, setHighlightedStocks] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  // 处理价格变化的高亮效果
  useEffect(() => {
    const oldStocks = queryClient.getQueryData<Stock[]>(['stocks', market]) || [];
    const changedStockIds = new Set<string>();

    stocks.forEach(stock => {
      const oldStock = oldStocks.find(s => s.id === stock.id);
      if (oldStock && (oldStock.price !== stock.price || oldStock.change !== stock.change)) {
        changedStockIds.add(stock.id);
      }
    });

    if (changedStockIds.size > 0) {
      setHighlightedStocks(changedStockIds);
      setTimeout(() => setHighlightedStocks(new Set()), 500);
    }
  }, [stocks, market]);

  const addMutation = useMutation(
    (values: Partial<Stock>) =>
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/create`, {
        params: { ...values, market }
      }),
    {
      onSuccess: () => {
        message.success('添加成功');
        queryClient.invalidateQueries(['stocks', market]);
        setIsModalVisible(false);
        form.resetFields();
      },
      onError: (error) => {
        console.error('添加失败:', error);
        message.error('添加失败，请重试');
      },
    }
  );

  const updateMutation = useMutation(
    (values: Partial<Stock>) =>
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/update/${values.id}`, {
        params: { ...values, market }
      }),
    {
      onSuccess: () => {
        message.success('更新成功');
        queryClient.invalidateQueries(['stocks', market]);
        setIsModalVisible(false);
        form.resetFields();
        setEditingStock(null);
      },
      onError: (error) => {
        console.error('更新失败:', error);
        message.error('更新失败，请重试');
      },
    }
  );

  const deleteMutation = useMutation(
    (stock: Stock) => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/delete`, {
      params: { id: stock.id, market }
    }),
    {
      onSuccess: () => {
        message.success('删除成功');
        queryClient.invalidateQueries(['stocks', market]);
      },
      onError: (error) => {
        console.error('删除失败:', error);
        message.error('删除失败，请重试');
      },
    }
  );

//   const handleAdd = () => {
//     setEditingStock(null);
//     form.resetFields();
//     setIsModalVisible(true);
//   };

  const handleEdit = (record: Stock) => {
    setEditingStock(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (stock: Stock) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个自选股吗？',
      onOk: () => deleteMutation.mutate(stock),
    });
  };

  const handleSubmit = (values: any) => {
    if (editingStock) {
      updateMutation.mutate({ ...values, id: editingStock.id });
    } else {
      addMutation.mutate(values);
    }
  };

  const generateRandomStock = () => {
    addMutation.mutate({});
  };

  const deleteAllMutation = useMutation(
    () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/delete-all`),
    {
      onSuccess: () => {
        message.success('删除成功');
        queryClient.invalidateQueries(['stocks', market]);
      },
      onError: (error) => {
        console.error('删除失败:', error);
        message.error('删除失败，请重试');
      },
    }
  );

  const deleteMarketMutation = useMutation(
    () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/delete-market`, {
      params: { market }
    }),
    {
      onSuccess: () => {
        message.success('删除成功');
        queryClient.invalidateQueries(['stocks', market]);
      },
      onError: (error) => {
        console.error('删除失败:', error);
        message.error('删除失败，请重试');
      },
    }
  );

  const handleDeleteAll = () => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除所有数据吗？',
      onOk: () => deleteAllMutation.mutate(),
    });
  };

  const handleDeleteMarket = () => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除${market === 'A' ? '沪深北交所' : market}市场的所有数据吗？`,
      onOk: () => deleteMarketMutation.mutate(),
    });
  };

  return (
    <div className="stock-list">


      <div className="floating-buttons">
        <Button
          className="report-button"
          icon={<PlusOutlined />}
          onClick={generateRandomStock}
          title="生成测试数据"
          disabled={isLoading}
        >
          测试数据
        </Button>
        <Button
          className="report-button"
          icon={<DeleteOutlined />}
          onClick={handleDeleteMarket}
          title="删除当前市场数据"
          disabled={isLoading}
        >
          删除当前市场
        </Button>
        <Button
          className="report-button ant-btn-dangerous"
          danger
          icon={<DeleteOutlined />}
          onClick={handleDeleteAll}
          title="删除所有数据"
          disabled={isLoading}
        >
          删除全部
        </Button>
      </div>
      <div className="stock-list">
        {isError ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <h3>数据加载失败</h3>
            <p>请检查网络连接后重试</p>
          </div>
        ) : isLoading ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <div className="loading-spinner" />
            <p>数据加载中...</p>
          </div>
        ) : stocks && stocks.length > 0 ? (
          stocks.map((stock) => (
            <div key={stock.id} className="stock-card">
              <div className="stock-info">
                <div className="stock-code">{stock.code}</div>
                <div className="stock-name">{stock.name}</div>
              </div>
              <div className="stock-data">
                <div className="stock-price-container">
                  <div className="stock-price">{stock.price.toFixed(2)}</div>
                  <div className="stock-change">
                    <span
                      className={`stock-change-value ${stock.change > 0 ? 'positive' : 'negative'} ${highlightedStocks.has(stock.id) ? 'highlight' : ''}`}
                    >
                      {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} / {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <Tooltip
                  title={<div>
                    {stock.priceHistory?.map((history) => (
                      <div key={history.id}>
                        {new Date(history.timestamp).toLocaleString()}: ¥{history.price.toFixed(2)}
                      </div>
                    ))}
                  </div>}
                  placement="right"
                >
                  <div className="stock-mini-chart">
                    <ResponsiveContainer width="100%" height={20}>
                      <LineChart data={stock.priceHistory || []}>
                        <YAxis domain={['dataMin', 'dataMax']} hide />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke={stock.change >= 0 ? '#4CAF50' : '#F44336'}
                          strokeWidth={1}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Tooltip>
              </div>
              <div className="stock-update-time">
                <ClockCircleOutlined spin />
                <span>{dayjs(stock.updatedAt).fromNow()}</span>
                <div className="time-detail">
                  更新于 {dayjs(stock.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>
              <div className="stock-actions">
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: '编辑',
                        onClick: () => handleEdit(stock)
                      },
                      {
                        key: 'delete',
                        icon: <DeleteOutlined />,
                        label: '删除',
                        danger: true,
                        onClick: () => handleDelete(stock)
                      }
                    ]
                  }}
                  trigger={['click']}
                >
                  <Button
                    type="text"
                    className="stock-more-button"
                    icon={<MoreOutlined />}
                  />
                </Dropdown>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <p>暂无数据</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          onShowSizeChange={(current, size) => onPageSizeChange(size)}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条记录`}
          disabled={isLoading}
        />
      </div>

      <Modal
        title={editingStock ? '编辑自选股' : '添加自选股'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="code"
            label="股票代码"
            rules={[{ required: true, message: '请输入股票代码' }]}
          >
            <Input placeholder="请输入股票代码" />
          </Form.Item>
          <Form.Item
            name="name"
            label="股票名称"
            rules={[{ required: true, message: '请输入股票名称' }]}
          >
            <Input placeholder="请输入股票名称" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StockList;