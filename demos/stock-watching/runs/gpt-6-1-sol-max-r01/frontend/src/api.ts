export type Market = "CN" | "HK" | "US";
export type Input = {
  market: Market;
  symbol: string;
  name: string;
  notes: string;
};
export type Quote = {
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  currency: string;
  series: number[];
  asOf: string;
  source: string;
};
export type Item = Input & {
  id: number;
  quote: Quote;
  createdAt: string;
  updatedAt: string;
};
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
const env = (import.meta as ImportMeta & { env: Record<string, string> }).env;
const base = (env.VITE_API_URL || "http://127.0.0.1:8080/api").replace(
  /\/$/,
  "",
);
export async function request<T>(
  path: string,
  method = "GET",
  body?: Input,
): Promise<T> {
  const controller = new AbortController(),
    deadline = setTimeout(() => controller.abort(), 6000),
    id = Math.random().toString(36).slice(2, 9);
  console.info("[watchdesk request]", { id, method, url: base + path, body });
  try {
    const response = await fetch(base + path, {
      method,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const text = await response.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { error: { message: "服务返回了无法解析的内容" } };
    }
    console.info("[watchdesk response]", {
      id,
      requestId: response.headers.get("X-Request-ID"),
      status: response.status,
      data,
    });
    if (!response.ok) {
      const error = data as { error?: { message?: string } };
      throw new ApiError(
        error?.error?.message || `请求失败 (${response.status})`,
        response.status,
      );
    }
    return data as T;
  } catch (error) {
    console.error("[watchdesk error]", { id, error });
    if (error instanceof ApiError) throw error;
    throw new ApiError("后端服务不可用，请检查服务地址、跨域配置和网络连接", 0);
  } finally {
    clearTimeout(deadline);
  }
}
const key = "watchdesk-local-demo-v1";
const seeds: Input[] = [
  { market: "CN", symbol: "600519", name: "贵州茅台", notes: "长期观察" },
  { market: "CN", symbol: "000001", name: "平安银行", notes: "" },
  { market: "HK", symbol: "00700", name: "腾讯控股", notes: "" },
  { market: "US", symbol: "AAPL", name: "Apple", notes: "" },
  { market: "US", symbol: "MSFT", name: "Microsoft", notes: "关注财报" },
];
function mock(input: Input, id: number): Item {
  const hash = Array.from(input.symbol).reduce(
      (n, c) => n + c.charCodeAt(0),
      0,
    ),
    base = 30 + hash * 1.87,
    change = Math.sin(hash) * base * 0.026;
  return {
    ...input,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    quote: {
      price: base + change,
      change,
      changePercent: (change / base) * 100,
      volume: 500000 + hash * 3400,
      currency: { CN: "CNY", HK: "HKD", US: "USD" }[input.market],
      series: Array.from(
        { length: 32 },
        (_, i) =>
          base +
          Math.sin(i * 0.21 + (hash % 9)) * base * 0.008 +
          (change * i) / 31,
      ),
      asOf: new Date().toISOString(),
      source: "mock",
    },
  };
}
export function localRead(): Item[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const value = JSON.parse(raw);
      if (
        Array.isArray(value) &&
        value.every(
          (v) =>
            typeof v.id === "number" &&
            typeof v.symbol === "string" &&
            v.quote &&
            Array.isArray(v.quote.series),
        )
      )
        return value;
    }
  } catch {
    /* Storage can be disabled. */
  }
  return seeds.map((s, i) => mock(s, i + 1));
}
export function localSave(items: Item[]) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    console.warn("本地存储不可用，演示数据仅在当前页面有效");
  }
}
export function localItem(body: Input, id: number) {
  return mock(body, id);
}
export const marketInfo = {
  CN: {
    name: "A 股 / 合约",
    currency: "CNY",
    hint: "例如 600519 或 IF2609",
    pattern: /^(?:[0-9]{6}|[A-Z]{1,6}[0-9]{3,4})$/,
  },
  HK: {
    name: "港股",
    currency: "HKD",
    hint: "例如 00700",
    pattern: /^[0-9]{5}$/,
  },
  US: {
    name: "美股",
    currency: "USD",
    hint: "例如 AAPL 或 BRK.B",
    pattern: /^[A-Z][A-Z0-9.]{0,11}$/,
  },
};
