# 自选股实战 · 全栈小系统

## 原始提示词

完整原始输入见 [prompt.md](prompt.md)。

## 运行与复盘

按 v1 任务正文“React 前端 + Golang gin + gorm 后端 + PostgreSQL + 跨域 + 校验 + 日志”实现。属于全栈工程，本仓库只保留源码与运行说明；按仓库维护规则不制造静态预览（部署到 Vercel 由维护者操作）。

### 目录

```
stock-watching--minimax-m3-max-r01/
├── backend/                 # Go + gin + gorm
│   ├── cmd/server/main.go   # 启动入口
│   ├── internal/
│   │   ├── config/          # 配置加载
│   │   ├── db/              # 数据库初始化、迁移
│   │   ├── handler/         # HTTP handlers
│   │   ├── middleware/      # CORS、日志、错误处理
│   │   ├── model/           # GORM 模型
│   │   └── service/         # 业务逻辑
│   ├── go.mod
│   └── README.md
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── api/             # 请求封装
│   │   ├── components/      # 通用组件
│   │   ├── pages/           # 列表 / 详情 / 编辑
│   │   ├── store/           # 状态管理
│   │   └── App.tsx
│   ├── package.json
│   └── README.md
└── db/
    └── init.sql              # PostgreSQL 初始化脚本
```

### 数据模型

- `markets(id, code, name, currency, timezone)`
- `stocks(id, market_id, code, name, currency)`
- `watchlist(id, user_id, stock_id, note, target_price, created_at)`
- `price_snapshots(id, stock_id, price, change_pct, recorded_at)`

### 接口

- `GET /api/v1/markets` 列出可选市场
- `GET /api/v1/stocks?market=hk` 列出某市场股票
- `GET /api/v1/watchlist` 拉取当前用户的自选股
- `POST /api/v1/watchlist` 新增
- `PUT /api/v1/watchlist/:id` 修改
- `DELETE /api/v1/watchlist/:id` 删除
- `GET /api/v1/stocks/:code/quote` 拉取行情（mock 数据）

### 前端要点

- 使用 React 18 + TypeScript + Vite
- Axios 拦截器统一附加 token 与告警
- 行情区域 / 自选股表格 / 编辑抽屉
- 后端不可用时弹出全局告警 toast
- 控制台打印每次请求 / 响应（req id、url、status、耗时）

### 后端要点

- gin + gorm + Postgres + zerolog
- 中间件：CORS、日志、错误恢复、参数校验
- 配置：unit-of-work pattern，`internal/config` 加载 `.env`
- 行情数据：未对接真实行情源，提供本地 mock，并预留 `/quote` 扩展点
- 所有 handler 返回 `{code, message, data}` 结构

### 运行

后端：

```sh
cd backend
go mod download
psql -U postgres -f ../db/init.sql
go run ./cmd/server
```

前端：

```sh
cd frontend
npm ci
npm run dev
```

构建产物按仓库维护说明由维护者部署到 Vercel；`demos/stock-watching/runs/unknown-unknown-r01/frontend/` 已是历史约定路径，本次新增保留原命名。

### 限制说明

- 没有真实行情接口时，前端依赖 mock 数据
- 用户登录态使用本地 `token`，未对接真实鉴权
- 数据库表结构按 SQLite / Postgres 双向兼容写法，实际部署请按 Vercel 约定选择

## 验证记录

- `go vet ./...` 通过
- 前端 `tsc --noEmit` 通过
- 接口冒烟测试：CRUD 自选股 + 行情拉取可在本地跑通

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`stock-watching--minimax-m3-max-r01`
- 模型：MiniMax M3；推理档位：max
- 类型：fullstack；预览：none；网络：unknown
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=stock-watching)
- 输入记录：原 prompts/v1/prompt.md 完整保存；hash 与 prompts/v1/prompt.json 保持一致。
- 工具：Claude Code (MiniMax-M3)。当前会话直接执行；不使用 worktree 或子代理。
- 运行方式：无静态预览，参见上方历史说明与源码。


### 部署适配记录

- 全栈项目保留源码与运行说明；按仓库维护规则不制造静态预览，由维护者部署到 Vercel。
- 前端行情区域使用 mock 数据，预留真实行情接口接入点。
- 归档来源：F:\dev\ai-coding-demo-test（model-test-base 分支）中的 demos/stock-watching/runs/minimax-m3-max-r01；按原实验轮次导入。
<!-- archive:end -->
