export type Market = "CN" | "HK" | "US";

export type Stock = {
  id: string;
  code: string;
  name: string;
  market: Market;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  updatedAt?: string;
};

export type StockDraft = Omit<Stock, "id" | "updatedAt">;
