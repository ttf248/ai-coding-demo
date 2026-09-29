// 简单的日志工具 —— 同时打到控制台并附带时间戳，便于排查前端与后端的通信问题。

const TAG_REQ = '[HTTP 请求]';
const TAG_RES = '[HTTP 响应]';
const TAG_ERR = '[HTTP 错误]';

function now(): string {
  return new Date().toISOString();
}

export interface LogContext {
  method: string;
  url: string;
  status?: number;
  duration?: number;
  body?: unknown;
  error?: unknown;
}

export function logRequest(ctx: { method: string; url: string; body?: unknown }) {
  // eslint-disable-next-line no-console
  console.log(`${TAG_REQ} ${now()} ${ctx.method} ${ctx.url}`, ctx.body ?? '');
}

export function logResponse(ctx: { method: string; url: string; status: number; duration: number; body?: unknown }) {
  // eslint-disable-next-line no-console
  console.log(
    `${TAG_RES} ${now()} ${ctx.status} ${ctx.method} ${ctx.url} (${ctx.duration}ms)`,
    ctx.body ?? '',
  );
}

export function logError(ctx: { method: string; url: string; error: unknown }) {
  // eslint-disable-next-line no-console
  console.error(`${TAG_ERR} ${now()} ${ctx.method} ${ctx.url}`, ctx.error);
}