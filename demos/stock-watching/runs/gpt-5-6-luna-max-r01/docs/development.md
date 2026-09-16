# 自选股 Luna Max · 开发说明

## 启动后端

准备 PostgreSQL 数据库后，在 `backend` 设置 `DATABASE_URL`，或设置 `DB_HOST`、`DB_USER`、`DB_PASSWORD`、`DB_NAME`、`DB_PORT` 和 `DB_SSLMODE`，然后运行：

```sh
go run .
```

默认监听 `http://localhost:8080`。`CORS_ORIGIN` 可设置为逗号分隔的前端来源；未设置时允许本地 Vite 端口。

## 启动前端

在 `frontend` 执行 `npm ci` 和 `npm run dev`。如后端不在 8080，设置 `VITE_API_URL`，例如 `http://localhost:8080/api`。

前端会在请求失败时显示明确告警，并保留本地样例用于观察布局；样例不会被标成实时行情。通信日志可从表格工具栏打开。

## 验证边界

本轮未连接仓库外的真实 PostgreSQL 或行情供应商，也未登记外部部署地址。数据库迁移、接口校验和前端错误分支可在本地环境继续验证。
