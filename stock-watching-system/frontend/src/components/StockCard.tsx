import React from 'react';
import { Button, Dropdown } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { Stock } from '../types/stock';
import { formatPrice, formatChange, formatChangePercent, getChangeColor } from '../utils/stockUtils';

interface StockCardProps {
  stock: Stock;
  isHighlighted: boolean;
  onEdit: (stock: Stock) => void;
  onDelete: (stock: Stock) => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, isHighlighted, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleChartClick = () => {
    navigate(`/stock/${stock.id}`);
  };
  return (
    <div key={stock.id} className="stock-card">
      <div className="stock-info">
        <div className="stock-code">{stock.code}</div>
        <div className="stock-name">{stock.name}</div>
      </div>
      <div className="stock-data">
        <div className="stock-price-container">
          <div className="stock-price">{formatPrice(stock.price)}</div>
          <div className="stock-change">
            <span
              className={`stock-change-value ${stock.change > 0 ? 'positive' : 'negative'} ${isHighlighted ? 'highlight' : ''}`}
              style={{ color: getChangeColor(stock.change) }}
            >
              {formatChange(stock.change)} / {formatChangePercent(stock.changePercent)}
            </span>
          </div>
        </div>
        <div className="stock-mini-chart" onClick={handleChartClick} style={{ cursor: 'pointer' }}>
          <ResponsiveContainer width="100%" height={20}>
            <LineChart data={stock.priceHistory || []}>
              <YAxis domain={['dataMin', 'dataMax']} hide />
              <Line
                type="monotone"
                dataKey="closePrice"
                stroke={stock.change >= 0 ? '#4CAF50' : '#F44336'}
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
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
                onClick: () => onEdit(stock)
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: '删除',
                danger: true,
                onClick: () => onDelete(stock)
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
  );
};

export default StockCard;