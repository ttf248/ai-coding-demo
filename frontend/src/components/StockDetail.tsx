import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'antd';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { PriceHistory } from '../types/stock';

interface StockDetailProps {
  priceHistory: PriceHistory[];
}

const StockDetail: React.FC<StockDetailProps> = ({ priceHistory }) => {
  const { stockId } = useParams<{ stockId: string }>();

  return (
    <div className="stock-detail">
      <Card title="价格走势" className="stock-detail-card">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={priceHistory}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
              formatter={(value: number) => [`¥${value.toFixed(2)}`, '价格']}
            />
            <Area
              type="monotone"
              dataKey="closePrice"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default StockDetail;