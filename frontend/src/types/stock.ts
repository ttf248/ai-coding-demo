export interface PriceHistory {
  id: number;
  stockId: string;
  price: number;
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