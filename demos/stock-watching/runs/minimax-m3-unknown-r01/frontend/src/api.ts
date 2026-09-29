import { logError, logRequest, logResponse } from './utils/logger';
import type { Stock } from './types/stock';

// 基础地址：dev 环境由 vite proxy 转发到 :8080，prod 环境可通过 VITE_API_BASE_URL 自定义
const BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

// 错误类型 —— 便于上层 UI 区分 "网络不可达" 与 "业务错误"
export class NetworkError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface StockPayload {
  code: string;
  name: string;
  market: string;
  price?: number;
  changePercent?: number;
}

// 通用请求封装：捕获异常、记录日志、统一错误格式
async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const startedAt = performance.now();

  logRequest({ method, url, body });

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: { 'content-type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    logError({ method, url, error: err });
    throw new NetworkError('后端服务不可用，请检查服务是否启动', err);
  }

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  const duration = Math.round(performance.now() - startedAt);

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'error' in (data as object)
        ? String((data as { error: unknown }).error)
        : `请求失败 (${res.status})`);
    logResponse({ method, url, status: res.status, duration, body: data });
    throw new ApiError(message, res.status);
  }

  logResponse({ method, url, status: res.status, duration, body: data });
  return data as T;
}

export interface StockListResponse {
  data: Stock[];
  total: number;
}

export const stocksApi = {
  list: (params?: { market?: string; code?: string; name?: string }) => {
    const qs = params
      ? '?' +
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
          .join('&')
      : '';
    return request<StockListResponse>('GET', `/api/stocks${qs}`);
  },

  create: (payload: StockPayload) =>
    request<Stock>('POST', '/api/stocks', payload),

  update: (
    id: number,
    payload: Partial<StockPayload>,
  ) => request<Stock>('PUT', `/api/stocks/${id}`, payload),

  remove: (id: number) =>
    request<{ message: string; id: number }>('DELETE', `/api/stocks/${id}`),

  removeAll: (market?: string) => {
    const qs = market ? `?market=${encodeURIComponent(market)}` : '';
    return request<{ message: string; rowsAffected: number }>(
      'DELETE',
      `/api/stocks${qs}`,
    );
  },
};