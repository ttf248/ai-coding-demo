export type MarketId = "CN" | "HK" | "US";

export interface Contract {
  id: number;
  market: MarketId;
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  updatedAt: string;
}

export interface ContractInput {
  market: MarketId;
  symbol: string;
  name: string;
  sector: string;
}

interface ApiErrorShape {
  error?: { code?: string; message?: string };
}

export class ApiRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export function isServiceUnavailable(error: unknown) {
  return !(error instanceof ApiRequestError) || error.status >= 500;
}

const apiRoot = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${apiRoot}${path}`;
  const method = options.method ?? "GET";
  let requestBody: unknown;
  if (typeof options.body === "string") {
    try {
      requestBody = JSON.parse(options.body);
    } catch {
      requestBody = options.body;
    }
  }
  console.info("[api] request", { method, url, body: requestBody });
  const startedAt = performance.now();

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
    const payload = response.status === 204 ? undefined : await response.json();
    console.info("[api] response", {
      method,
      url,
      status: response.status,
      ok: response.ok,
      durationMs: Math.round(performance.now() - startedAt),
      body: payload,
    });

    if (!response.ok) {
      const errorPayload = payload as ApiErrorShape | undefined;
      throw new ApiRequestError(errorPayload?.error?.message ?? `请求失败（${response.status}）`, response.status);
    }
    return payload as T;
  } catch (error) {
    console.error("[api] communication error", {
      method,
      url,
      durationMs: Math.round(performance.now() - startedAt),
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export const api = {
  health: () => request<{ status: string; service: string }>("/healthz"),
  listContracts: (market: MarketId, query: string) => {
    const params = new URLSearchParams({ market });
    if (query.trim()) params.set("q", query.trim());
    return request<{ data: Contract[] }>(`/contracts?${params.toString()}`);
  },
  createContract: (contract: ContractInput) =>
    request<{ data: Contract }>("/contracts", { method: "POST", body: JSON.stringify(contract) }),
  updateContract: (id: number, contract: Omit<ContractInput, "market">) =>
    request<{ data: Contract }>(`/contracts/${id}`, { method: "PUT", body: JSON.stringify(contract) }),
  deleteContract: (id: number) => request<void>(`/contracts/${id}`, { method: "DELETE" }),
};
