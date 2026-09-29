# 自选股 · MiniMax M3

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

按主题 v1 任务生成 React 前端 + Go (Gin + Gorm) 后端的全栈自选股应用。**preview.kind = "external" + embed = false**：保留源码与运行说明，未部署到具体 URL。

### 前端（`frontend/`）

- Vite + React 18 + TypeScript。
- 多市场 Tab：全部 / 沪 A / 深 A / 北 A / 港股 / 美股。
- 自选股表格：代码 / 名称 / 市场 / 价格 / 涨跌幅 + 编辑 / 删除。
- 新增 / 编辑弹层表单（客户端校验 + 服务端校验）。
- Toast 通知（success / error / warning）。
- `utils/logger.ts` 打印每次请求 / 响应 / 网络错误。
- 后端不可达时显式 banner「后端服务不可用，请检查服务是否启动」。
- 开发态 Vite 代理 `/api` → `http://localhost:8080`。

### 后端（`backend/`）

- Go + Gin + Gorm。
- `main.go`：Gin engine、CORS（开发态全开）、HTTP 请求 / 响应 logger、`/api/health`、404 handler。
- `routes/routes.go`：`GET /api/stocks`、`POST /api/stocks`、`PUT /api/stocks/:id`、`DELETE /api/stocks/:id`、`DELETE /api/stocks`（批量）。
- `controllers/stock_controller.go`：参数校验、市场白名单、重复校验、统一错误 JSON。
- `models/stock.go`：`Stock{ID uint, Code, Name, Market, Price, ChangePercent, CreatedAt, UpdatedAt}` + `StockTick` + `StockUpdate`。
- `database/db.go`：默认 SQLite（`backend/stocks.db`），启动自动迁移；通过 `DB_DRIVER=postgres` 或 `USE_POSTGRES=1` 切换到 PostgreSQL（`gorm.io/driver/postgres` 已就绪）。
- `utils/stock_generator.go`：根据市场生成 mock 价格 tick。

### 运行

```sh
# 后端（默认 SQLite）
cd backend && go mod tidy && go run main.go
# 前端
cd frontend && npm install --no-audit --no-fund --prefer-offline
npm run dev
```

### 切换到 PostgreSQL

```sh
export DB_DRIVER=postgres
export DB_DSN="host=localhost user=postgres password=xxx dbname=stocks port=5432 sslmode=disable"
cd backend && go run main.go
```

### 部署

详见 `docs/development.md` 与 `docs/deployment.md`。

构建验证（已通过）：`go build ./...` 0 退出；`npm run build -- --base=./` 生成 dist。源码提交，未跑 build:demo。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`stock-watching--minimax-m3-unknown-r01`
- 模型：MiniMax M3；推理档位：unknown
- 类型：fullstack；预览：none；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=stock-watching)
- 输入记录：保留主题 v1 任务正文。
- 工具：未记录。通过 minimax-m3 模型执行；具体平台上下文未记录。后端可通过 DB_DRIVER=postgres 切换到 PostgreSQL。
- 运行方式：无静态预览，参见上方历史说明与源码。


### 部署适配记录

- 按主题 v1 任务生成 React + Go (Gin + Gorm) 全栈应用。
- 前端：多市场切换、自选股 CRUD、行情展示、错误提示、网络日志。
- 后端：RESTful CRUD + 跨域 + 请求应答日志 + 校验；默认 SQLite 即开即用。
- preview.kind=none + embed=false（仓库惯例）：保留源码，未部署到具体 URL。
<!-- archive:end -->
