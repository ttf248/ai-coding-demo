# 本地开发

本目录包含一个 React + TypeScript + Vite 前端、Go + Gin + GORM API 和 PostgreSQL 配置。项目只提供本地开发方式；没有配置或声明外部部署地址。

## 环境要求

- Node.js 20.19+ 或 22.12+（建议 22）和 npm
- Go 1.23 或更高版本
- Docker Desktop / Docker Engine（用于本地 PostgreSQL）

## 启动 PostgreSQL

在本目录复制环境变量示例，然后启动数据库：

```powershell
Copy-Item .env.example .env
docker compose up -d postgres
```

Compose 会在 `127.0.0.1:5432` 提供 PostgreSQL，数据库名为 `stock_watchlist`，本地开发账号为 `watchlist`。数据保存在 `stock-watchlist-pg` 命名卷中。首次连接时 Go 服务会自动创建 `contracts` 表；停止或重启数据库不会删除已有记录。

`.env` 中的 `DATABASE_URL`、`PORT`、`CORS_ALLOWED_ORIGINS` 和 `LOG_LEVEL` 可按本机环境调整。不要把包含真实密码的 `.env` 提交到版本库。

## 启动 Go API

在第一个终端运行：

```powershell
Set-Location backend
go mod download
go run .
```

API 默认监听 `http://127.0.0.1:8080`。可访问 `http://127.0.0.1:8080/api/healthz` 检查服务。服务启动需要能够连接 PostgreSQL；数据库不可用时，进程会记录结构化错误并退出。

服务端每个请求和响应各打印一条 JSON 日志，含请求 ID、HTTP 方法、路径、状态码、耗时和响应字节数，不记录请求正文。浏览器开发者工具 Console 会打印 API 请求、应答和网络错误。

## 启动前端

在第二个终端，从本目录的 `frontend` 文件夹运行：

```powershell
Set-Location frontend
npm install
npm run dev
```

打开 Vite 显示的本地地址（默认 `http://127.0.0.1:5173`）。开发服务器会将 `/api` 请求代理到 `http://127.0.0.1:8080`。如需更改 API 端口，在 `frontend/.env.local` 设置 `VITE_BACKEND_ORIGIN=http://127.0.0.1:<端口>`；独立跨域访问时，则设置 `VITE_API_BASE_URL=http://127.0.0.1:<端口>/api`，并将前端 Origin 加入后端 `CORS_ALLOWED_ORIGINS`，多个地址用逗号分隔。后端默认只允许本地 Vite 地址，不启用凭据或通配来源。

## 功能和接口

- 市场：A 股（`CN`）、港股（`HK`）、美股（`US`）。代码按市场校验；同一市场内代码唯一。
- 自选列表支持按代码、名称、行业搜索，以及添加、查看、编辑和删除。每个市场的数据独立保存在 PostgreSQL。
- `GET /api/healthz`：服务健康状态。
- `GET /api/markets`：支持的市场。
- `GET /api/contracts?market=CN&q=茅台`：查询市场合约，可选搜索词。
- `GET /api/contracts/:id`：读取合约。
- `POST /api/contracts`：添加合约，JSON 字段为 `market`、`symbol`、`name` 和可选的 `sector`。
- `PUT /api/contracts/:id`：修改 `symbol`、`name` 和 `sector`，合约市场保持不变。
- `DELETE /api/contracts/:id`：删除合约。

列表接口最多返回 200 条。错误响应统一使用 `{ "error": { "code": "...", "message": "..." } }`；无效输入返回 400，重复代码返回 409，缺失记录返回 404。数据库错误不会返回 SQL 细节。

## 行情数据说明

API 返回的价格、涨跌和成交量是按市场与代码确定性生成的演示快照，不来自证券交易所或行情供应商，也不会随真实市场变化。界面会标注演示行情；不要据此进行投资决策。接入真实行情需要另行选择并配置数据供应商。

## 本地检查

```powershell
# 在 frontend 目录
npm run typecheck
npm run build

# 在 backend 目录
gofmt -w main.go
go build ./...
go test ./...
```
