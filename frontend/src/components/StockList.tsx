import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Dropdown, Tooltip } from 'antd';
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
}

const StockList: React.FC<StockListProps> = ({ stocks, isError, market }) => {
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
      axios.post(`http://localhost:8080/api/stocks`, { ...values, market }),
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
      axios.put(`http://localhost:8080/api/stocks/${values.id}`, { ...values, market }, {
        params: { market }
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
    (stock: Stock) => axios.delete(`http://localhost:8080/api/stocks`, {
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

  const handleAdd = () => {
    setEditingStock(null);
    form.resetFields();
    setIsModalVisible(true);
  };

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

  const columns = [
    {
      title: '代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '最新价',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => price.toFixed(2),
    },
    {
      title: '涨跌',
      dataIndex: 'change',
      key: 'change',
      render: (change: number) => (
        <span style={{ color: change > 0 ? '#f5222d' : change < 0 ? '#52c41a' : 'inherit' }}>
          {change.toFixed(2)}
        </span>
      ),
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      render: (percent: number) => (
        <span style={{ color: percent > 0 ? '#f5222d' : percent < 0 ? '#52c41a' : 'inherit' }}>
          {percent.toFixed(2)}%
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Stock) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const generateRandomStock = () => {
    const randomId = crypto.randomUUID();
    
    // 根据市场生成对应的股票代码和名称
    let randomCode, randomName;
    if (market === 'sh' || market === 'sz') {
      // 沪深市场：随机选择上海或深圳
      const actualMarket = Math.random() < 0.5 ? 'sh' : 'sz';
      if (actualMarket === 'sh') {
        // 上海市场：60或68开头
        const prefix = Math.random() < 0.8 ? '60' : '68';
        randomCode = prefix + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const industries = ['科技', '股份', '电子', '医药', '新材料', '机械', '软件', '通信'];
        const industry = industries[Math.floor(Math.random() * industries.length)];
        randomName = `上海${randomCode.slice(2, 6)}${industry}`;
      } else {
        // 深圳市场：000、002（主板）或300、301（创业板）开头
        const prefixes = ['000', '002', '300', '301'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        randomCode = prefix + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const industries = ['科技', '股份', '电子', '医药', '新材料', '机械', '软件', '通信'];
        const industry = industries[Math.floor(Math.random() * industries.length)];
        randomName = `${prefix.startsWith('30') ? '创业' : '深圳'}${randomCode.slice(-3)}${industry}`;
      }
    } else if (market === 'hk') {
      // 港股市场：4位或5位数字
      const isLongCode = Math.random() < 0.3; // 30%概率使用5位代码
      randomCode = Math.floor(Math.random() * (isLongCode ? 90000 : 9000) + 1).toString().padStart(isLongCode ? 5 : 4, '0');
      const industries = ['控股', '集团', '电子', '医药', '地产', '银行', '保险', '科技'];
      const industry = industries[Math.floor(Math.random() * industries.length)];
      randomName = `港${randomCode}${industry}`;
    } else {
      // 美股市场：2-4个字母的知名公司缩写
      const commonTickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'AMD', 'INTC', 'IBM'];
      if (Math.random() < 0.3) { // 30%概率使用知名公司代码
        randomCode = commonTickers[Math.floor(Math.random() * commonTickers.length)];
        const companyNames = {
          'AAPL': 'Apple Inc.',
          'MSFT': 'Microsoft Corp.',
          'GOOGL': 'Alphabet Inc.',
          'AMZN': 'Amazon.com Inc.',
          'META': 'Meta Platforms Inc.',
          'TSLA': 'Tesla Inc.',
          'NVDA': 'NVIDIA Corp.',
          'AMD': 'Advanced Micro Devices Inc.',
          'INTC': 'Intel Corp.',
          'IBM': 'International Business Machines Corp.'
        };
        randomName = companyNames[randomCode as keyof typeof companyNames];
      } else {
        // 生成随机代码
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const length = Math.floor(Math.random() * 3) + 2; // 2-4位字母
        randomCode = Array.from({length}, () => letters[Math.floor(Math.random() * letters.length)]).join('');
        const industries = ['Technologies', 'Electronics', 'Pharmaceuticals', 'Solutions', 'Systems', 'Networks'];
        const industry = industries[Math.floor(Math.random() * industries.length)];
        randomName = `${randomCode} ${industry} Inc.`;
      }
    }

    // 生成更真实的价格和波动
    let basePrice, maxChange;
    if (market === 'HK') {
      basePrice = +(Math.random() * 200 + 1).toFixed(3); // 港股价格范围更大，精确到3位小数
      maxChange = 0.1; // 最大10%波动
    } else if (market === 'US') {
      basePrice = +(Math.random() * 500 + 1).toFixed(2); // 美股价格范围最大
      maxChange = 0.15; // 最大15%波动
    } else {
      basePrice = +(Math.random() * 100 + 1).toFixed(2); // A股价格范围
      maxChange = 0.1; // 最大10%波动，符合涨跌停规则
    }

    const randomPrice = basePrice;
    const changePercent = (Math.random() * maxChange * 2 - maxChange); // 在最大波动范围内随机
    const randomChange = +(basePrice * changePercent).toFixed(2);
    const randomChangePercent = +(changePercent * 100).toFixed(2);

    const newStock = {
      id: randomId,
      code: randomCode,
      name: randomName,
      price: randomPrice,
      change: randomChange,
      changePercent: randomChangePercent
    };

    addMutation.mutate(newStock);
  };

  return (
    <div className="stock-list">
      <div style={{ marginBottom: 16 }}>
        <Space>
        </Space>
      </div>

      <div className="floating-buttons">
        <Button
          className="report-button"
          icon={<BarChartOutlined />}
          onClick={() => message.info('生成报告功能开发中')}
          title="生成并查看报告"
        >
          查看报告
        </Button>
        <Button
          className="test-button"
          icon={<PlusOutlined rotate={45} />}
          onClick={generateRandomStock}
          title="生成测试数据"
        >
          测试数据
        </Button>
      </div>

      <div className="stock-list">
        {isError ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <h3>数据加载失败</h3>
            <p>请检查网络连接后重试</p>
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