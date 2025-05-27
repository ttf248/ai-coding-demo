export interface PriceHistory {
  id: number;
  stockId: string;
  openPrice: number;     // 开盘价
  highPrice: number;     // 最高价
  lowPrice: number;      // 最低价
  closePrice: number;    // 收盘价（最新价）
  preClosePrice: number; // 昨收价
  volume: number;        // 成交量
  amount: number;        // 成交额
  timestamp: string;
}

export interface Stock {
  id: string;
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  updatedAt?: string;
  priceHistory: PriceHistory[];
}

export interface StockListProps {
  stocks: Stock[];
  isError: boolean;
  market: string;
}