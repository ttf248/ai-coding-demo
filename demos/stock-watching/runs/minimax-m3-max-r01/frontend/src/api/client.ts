import axios from "axios";

export const http = axios.create({
  baseURL: "/api/v1",
  timeout: 5000,
});

http.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};
  config.headers["X-Request-ID"] = `web-${Date.now().toString(36)}`;
  return config;
});

let toastHandler: ((msg: string, level: "info" | "error") => void) | null =
  null;
export function bindToast(
  fn: (msg: string, level: "info" | "error") => void,
) {
  toastHandler = fn;
}

http.interceptors.response.use(
  (res) => {
    console.info("[http]", {
      request_id: res.headers["x-request-id"],
      method: res.config.method,
      url: res.config.url,
      status: res.status,
      cost: res.headers["x-response-time"] ?? "(missing)",
      data: res.data,
    });
    return res;
  },
  (err) => {
    if (err.response) {
      console.error("[http]", {
        method: err.config?.method,
        url: err.config?.url,
        status: err.response.status,
        body: err.response.data,
      });
      toastHandler?.(`后端响应异常 ${err.response.status}`, "error");
    } else if (err.code === "ECONNABORTED") {
      console.error("[http] timeout", err.config?.url);
      toastHandler?.("请求超时，请检查后端服务", "error");
    } else {
      console.error("[http] network error", err.message);
      toastHandler?.("后端服务不可用", "error");
    }
    return Promise.reject(err);
  },
);