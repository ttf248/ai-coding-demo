import { http } from "./client";

export type Market = {
  id: number;
  code: string;
  name: string;
  currency: string;
  timezone: string;
};

export type Stock = {
  id: number;
  market_id: number;
  code: string;
  name: string;
  market?: Market;
};

export type Watchlist = {
  id: number;
  user_id: number;
  stock_id: number;
  stock?: Stock;
  note: string;
  target_price?: string | null;
  created_at: string;
};

export type Quote = {
  stock: Stock;
  price: string;
  change: string;
  timestamp: string;
};

export async function fetchMarkets(): Promise<Market[]> {
  const { data } = await http.get<{ data: Market[] }>("/markets");
  return data.data;
}

export async function fetchStocks(market?: string): Promise<Stock[]> {
  const { data } = await http.get<{ data: Stock[] }>("/stocks", {
    params: market ? { market } : undefined,
  });
  return data.data;
}

export async function fetchQuote(code: string): Promise<Quote> {
  const { data } = await http.get<{ data: Quote }>(`/stocks/${code}/quote`);
  return data.data;
}

export async function fetchWatchlist(userId: number): Promise<Watchlist[]> {
  const { data } = await http.get<{ data: Watchlist[] }>("/watchlist", {
    params: { user_id: userId },
  });
  return data.data;
}

export async function createWatchlist(payload: {
  user_id: number;
  stock_id: number;
  note?: string;
  target_price?: string | null;
}): Promise<Watchlist> {
  const { data } = await http.post<{ data: Watchlist }>("/watchlist", payload);
  return data.data;
}

export async function updateWatchlist(
  id: number,
  payload: {
    user_id: number;
    stock_id: number;
    note?: string;
    target_price?: string | null;
  },
): Promise<Watchlist> {
  const { data } = await http.put<{ data: Watchlist }>(
    `/watchlist/${id}`,
    payload,
  );
  return data.data;
}

export async function deleteWatchlist(id: number): Promise<void> {
  await http.delete(`/watchlist/${id}`);
}