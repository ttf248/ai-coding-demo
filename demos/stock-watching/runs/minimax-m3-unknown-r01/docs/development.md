# 自选股 · MiniMax M3 · 开发指南

本目录记录 MiniMax M3 模型在 `stock-watching` 主题上的运行产物（仅源代码，无预览）。

## 目录结构

```
run/
├── frontend/   # Vite + React + TypeScript 前端
├── backend/    # Go + Gin + Gorm 后端
├── docs/       # 开发与部署说明
├── imgs/       # 原始输入截图（占位）
├── prompt.md   # 任务正文（共享版本 v1）
├── Readme.md   # 归档说明
└── run.json    # 元数据
```

## 后端运行

后端使用 Go 1.22+，依赖 Gin / Gorm。**默认启用 SQLite**（文件 `stocks.db`，首次启动自动创建 + 迁移），方便本地无数据库启动。如需切换 PostgreSQL，设置 `DB_DRIVER=postgres`（或 `USE_POSTGRES=1`）并配置 `DB_HOST / DB_USER / DB_PASSWORD / DB_NAME / DB_PORT`。

```bash
cd backend
go mod tidy
go run main.go
# 默认监听 :8080
```

### API 一览

| 方法     | 路径                | 说明                                |
| -------- | ------------------- | ----------------------------------- |
| GET      | `/api/health`       | 健康检查                            |
| GET      | `/api/stocks`       | 查询自选股；支持 `?market=US/HK/...` |
| POST     | `/api/stocks`       | 新增自选股                          |
| PUT      | `/api/stocks/:id`   | 修改自选股                          |
| DELETE   | `/api/stocks/:id`   | 删除单条                            |
| DELETE   | `/api/stocks`       | 批量删除（可选 `?market=...`）      |

请求/响应日志通过 `gin.Default()` 风格的中间件打印，格式：

```
[HTTP] 200 |      1.2ms |     127.0.0.1 | GET    /api/stocks
```

## 前端运行

```bash
cd frontend
npm install
npm run dev
# 默认 http://localhost:5173
```

通过 `VITE_API_BASE_URL`（默认 `http://localhost:8080`）控制后端地址。

### 前端日志

- 每次 HTTP 请求在控制台打印 `[HTTP 请求]`、`[HTTP 响应]`
- 错误以 `[HTTP 错误]` 打印
- 后端不可达时，页面顶部显示 **"后端服务不可用，请检查服务是否启动"**

## 数据库切换

默认 SQLite：

```bash
# 默认行为，无需环境变量
go run main.go
```

切换到 PostgreSQL：

```bash
export DB_DRIVER=postgres
export DB_HOST=localhost
export DB_USER=postgres
export DB_PASSWORD=123456
export DB_NAME=stocks
go run main.go
```

或在 Windows PowerShell：

```powershell
$env:DB_DRIVER="postgres"
$env:DB_HOST="localhost"
go run main.go
```

## 常见问题

### 1. 端口占用

```bash
# 修改端口
export PORT=9090
go run main.go
```

### 2. SQLite 残留导致查重

如需彻底重置，删除 `backend/stocks.db` 文件后重启即可。

### 3. CORS

后端默认开启 `AllowAllOrigins`，前端无需额外配置。