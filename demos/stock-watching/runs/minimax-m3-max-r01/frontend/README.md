# 自选股实战 · 前端

React 18 + TypeScript + Vite + Axios。

## 启动

```sh
npm ci
npm run dev      # http://localhost:5173
```

`vite.config.ts` 把 `/api` 代理到 `http://localhost:8080`。

## 行为

- 自选股列表每 8 秒自动刷新
- 后端异常时弹出全局 toast
- 控制台打印每次请求的 method / url / status / body，便于排查

## 构建

```sh
npm run build    # dist/
```

部署由维护者上传到 Vercel（按仓库维护规则）。