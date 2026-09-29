// 自选股相关类型

export type MarketCode = 'US' | 'HK' | 'SH' | 'SZ' | 'BJ';

export interface Stock {
  id: number;
  code: string;
  name: string;
  market: MarketCode | string;
  price: number;
  changePercent: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockFormValues {
  code: string;
  name: string;
  market: MarketCode | '';
  price: number | '';
  changePercent: number | '';
}

export interface MarketOption {
  code: MarketCode;
  label: string;
}

export const MARKETS: MarketOption[] = [
  { code: 'SH', label: '沪 A' },
  { code: 'SZ', label: '深 A' },
  { code: 'BJ', label: '北 A' },
  { code: 'HK', label: '港股' },
  { code: 'US', label: '美股' },
];