export type Contract = {
  id: number;
  market: string;
  symbol: string;
  name: string;
  note: string;
  quote: {
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    currency: string;
    timestamp: string;
    source: string;
  };
};
export type Draft = Pick<Contract, "market" | "symbol" | "name" | "note">;
const apiBase =
  (import.meta as unknown as { env: { VITE_API_BASE?: string } }).env
    .VITE_API_BASE || "/api";
export async function request<T>(
  path: string,
  method = "GET",
  body?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort("timeout"), 8000);
  const abort = () => controller.abort(signal?.reason);
  if (signal?.aborted) abort();
  else signal?.addEventListener("abort", abort, { once: true });
  console.info("[API request]", method, path, body ?? "");
  try {
    const response = await fetch(apiBase + path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const text = response.status === 204 ? "" : await response.text();
    let data: any = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          response.ok
            ? "后端返回无效数据"
            : "后端不可用，请检查 Go 服务和数据库",
        );
      }
    }
    console.info(
      "[API response]",
      method,
      path,
      response.status,
      response.headers.get("X-Request-ID"),
      data,
    );
    if (!response.ok)
      throw new Error(data?.error?.message || `HTTP ${response.status}`);
    return data as T;
  } catch (e) {
    if (signal?.aborted) throw e;
    console.error("[API failure]", method, path, e);
    if (controller.signal.aborted) throw new Error("请求超时，请检查后端状态");
    if (e instanceof TypeError)
      throw new Error("后端不可用，请检查 Go 服务和数据库");
    throw e;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
}
