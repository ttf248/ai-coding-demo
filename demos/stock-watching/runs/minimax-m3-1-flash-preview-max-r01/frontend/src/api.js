// 与后端通信的统一封装：负责拼接地址、注入请求头、打印通信日志、归一化错误。
const BASE = (import.meta.env.VITE_API_BASE || "/api/v1").replace(/\/$/, "");
const USER_KEY = import.meta.env.VITE_USER_KEY || "demo";

/** 通信日志回调，由 App 注册后渲染到界面。 */
let logger = () => {};
export function setLogger(fn) {
  logger = fn;
}

function line(direction, method, url, body, status, payload, duration, error) {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toLocaleTimeString("zh-CN", { hour12: false }),
    direction,
    method,
    url,
    body,
    status,
    payload,
    duration,
    error,
  };
  // 同时打到浏览器控制台，方便在 DevTools 里排查
  const tag = direction === "→" ? "请求" : "应答";
  if (error) {
    console.error(`[api] ${tag}失败 ${method} ${url} (${duration}ms)`, error, payload ?? "");
  } else {
    console.log(`[api] ${tag} ${method} ${url} ${status ?? ""} (${duration}ms)`, payload ?? "");
  }
  logger(entry);
}

/** 后端不可用时抛出的错误，界面据此展示告警条。 */
export class ApiError extends Error {
  constructor(message, { status, code, fields, cause, offline } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields || {};
    this.offline = !!offline;
    this.cause = cause;
  }
}

async function request(method, path, { query, body } = {}) {
  const url = new URL(BASE + path, window.location.origin);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    }
  }
  const started = performance.now();
  const init = {
    method,
    headers: {
      "X-User-Key": USER_KEY,
      Accept: "application/json",
    },
  };
  if (body !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  line("→", method, url.pathname + url.search, body, null, null, 0, null);
  let response;
  try {
    response = await fetch(url, init);
  } catch (cause) {
    const duration = Math.round(performance.now() - started);
    const message = "无法连接后端服务，请确认后端已启动并检查 CORS 配置";
    line("←", method, url.pathname + url.search, null, null, null, duration, message);
    throw new ApiError(message, { offline: true, cause });
  }

  const duration = Math.round(performance.now() - started);
  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const err = payload?.error || {};
    // 代理层（Vite dev proxy / 网关 / 反向代理）自身报错时不会返回后端的统一结构，
    // 这种响应说明后端根本没起来，按“不可用”处理而不是普通业务错误。
    const fromGateway = !err.code;
    const message = fromGateway
      ? `后端服务不可用（代理返回 HTTP ${response.status}），请确认后端已启动`
      : err.message || `请求失败（HTTP ${response.status}）`;
    line("←", method, url.pathname + url.search, null, response.status, payload, duration, message);
    throw new ApiError(message, {
      status: response.status,
      code: err.code,
      fields: err.fields,
      offline: fromGateway,
    });
  }

  line("←", method, url.pathname + url.search, null, response.status, payload, duration, null);
  return payload;
}

export const api = {
  health: () => request("GET", "/health"),
  markets: () => request("GET", "/markets"),
  symbols: (marketCode) => request("GET", `/markets/${marketCode}/symbols`),
  list: (market, q) => request("GET", "/watchlist", { query: { market, q } }),
  quotes: (market, codes) =>
    request("GET", "/quotes", { query: { market, codes: codes?.join(",") } }),
  create: (payload) => request("POST", "/watchlist", { body: payload }),
  update: (id, payload) => request("PUT", `/watchlist/${id}`, { body: payload }),
  remove: (id) => request("DELETE", `/watchlist/${id}`),
};
