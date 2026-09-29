# 自选股全栈小系统（任务正文 v1）

一个可运行的全栈自选股系统：**React 18 前端 + Go Gin/GORM 后端 + PostgreSQL**。
支持 A 股 / 港股 / 美股切换，自选股的新增、删除、修改、查询，列表直接展示基础行情；
后端提供跨域、参数校验、统一错误结构与请求 / 应答日志，前端打印每一次通信的请求与应答，
后端不可用时页面给出明确告警并自动重试。

> 本项目是全栈应用，没有可公开访问的静态预览地址，因此归档中不登记 `external`。
> 源码与运行方式都在本目录，按下面的步骤即可在本地跑起来。

## 目录

```
docker-compose.yml          一条命令起 PostgreSQL
backend/                    Go 服务
  main.go                   启动、优雅退出、超时配置
  .env.example              全部可配置项
  migrations/001_init.sql   参考 DDL（服务启动时用 AutoMigrate 自动建表）
  internal/
    config/                 环境变量读取
    database/               连接池、AutoMigrate、种子数据
    models/                 实体与出入参结构
    repository/             自选股与基础数据访问
    service/                行情数据源（接口 + 模拟实现）
    handler/                HTTP 接口
    middleware/             CORS、请求日志、panic 恢复、请求 ID
    apperr/                 统一错误类型
frontend/                   React 应用
  src/api.js                接口封装 + 通信日志
  src/App.jsx               页面编排、轮询、告警与重试
  src/components/           表格、弹窗、通信日志面板
```

## 本地运行

```sh
# 1. 数据库
docker compose up -d          # 或者用本机已有的 PostgreSQL

# 2. 后端
cd backend
cp .env.example .env          # 按需修改
go run .                      # 默认监听 :8080

# 3. 前端（另开一个终端）
cd frontend
npm ci
npm run dev                   # http://localhost:5173
```

前端开发服务器把 `/api` 代理到 `http://127.0.0.1:8080`，因此本地不需要额外处理跨域；
但后端仍然实现了完整的 CORS 中间件，直接跨域访问时把前端地址加进 `CORS_ORIGINS` 即可。

首次启动时后端会自动建表，并写入 A 股 / 港股 / 美股三个市场与 15 个示例代码。

## 接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/v1/health` | 健康检查。数据库不通时返回 503 + `status: degraded` |
| GET | `/api/v1/markets` | 市场列表 |
| GET | `/api/v1/markets/:marketCode/symbols` | 某市场下的代码列表 |
| GET | `/api/v1/watchlist?market=&q=` | 查询自选股（可按市场过滤、按关键字搜索） |
| POST | `/api/v1/watchlist` | 新增，重复添加返回 409 |
| PUT | `/api/v1/watchlist/:id` | 修改备注 / 提醒价 / 排序（部分更新） |
| DELETE | `/api/v1/watchlist/:id` | 删除 |
| GET | `/api/v1/quotes?market=&codes=` | 批量行情 |

用户维度由请求头 `X-User-Key` 区分，缺省为 `demo`。

统一响应结构：

```json
{ "requestId": "…", "data": { } }
{ "requestId": "…", "error": { "code": "INVALID_INPUT", "message": "请求参数不合法", "fields": { "note": "备注不能超过 200 字" } } }
```

## 关键实现

### 跨域

`middleware.CORS` 接受白名单来源列表，回显 `Access-Control-Allow-Origin`，
放行 `Content-Type / Authorization / X-User-Key / X-Request-Id`，
`OPTIONS` 预检直接返回 204 并带 10 分钟 `Max-Age`。

### 校验与错误处理

- 请求体用结构体 tag 做必填校验，业务规则（备注长度、提醒价非负、排序非负、id 为正整数）在 handler 里显式校验，
  错误信息带字段名返回，前端可以直接标红对应输入框。
- 数据库层的「记录不存在」统一映射为 404，重复添加映射为 409。
- `middleware.Recovery` 兜住 panic，返回同一套错误结构并打印堆栈。
- 包级 `ErrXxx` 是只读模板，`WithField` / `WithCause` 返回副本，避免并发请求串字段。

### 日志

- 后端：`middleware.RequestID` 生成或透传 `X-Request-Id`；`middleware.Logger` 打印
  `[req] 方法 路径 来源IP query 请求体摘要` 与 `[resp] 状态码 字节数 耗时`，5xx 额外记录底层原因。
  请求体读取后会被放回，handler 仍能正常解析。
- 前端：`src/api.js` 在每次请求前后打一条日志，同时输出到浏览器控制台和页面底部的
  「通信日志」折叠面板（可按全部 / 失败 / 成功过滤）。

### 后端不可用

三层保护：

1. 数据库连不上时后端不退出，以只读模式继续监听，数据库接口统一返回 503；
2. 前端把「代理层 5xx（不含后端 error.code）」和「fetch 直接失败」都判定为后端不可用，
   停止轮询，顶部出现两条告警（一条说明原因与排查方式，一条说明数据为缓存且 8 秒后自动重试）；
3. 恢复后自动重新拉取健康检查并恢复行情刷新。

### 行情数据源

`service.QuoteProvider` 是接口，当前实现 `SimulatedProvider` 按「代码 + 15 秒时间桶」确定性生成
价格、昨收、今开、最高、最低、成交量与涨跌幅：同一时刻重复请求结果一致，随时间自然变化，
响应里 `source: "simulated"` 标明来源。接真实行情时新增一个实现并切换 `QUOTE_MODE` 即可，
handler 与前端都不需要改。

## 验证记录

- `go build ./...`、`go vet ./...`、`gofmt` 均通过。
- `go run .` 实际启动后逐项核对：跨域响应头、预检 204、`X-Request-Id` 回传、
  备注超长 / 缺少必填 / id 非法三种校验错误、数据库缺失时的 503、以及 `[req]` `[resp]` 两条日志。
- 前端 `npm run build` 通过；用真实浏览器打开开发服务器，确认后端宕机时出现「后端不可用」告警与通信日志面板。
- **未覆盖**：测试环境没有可用的 PostgreSQL 实例，带数据库的自选股读写链路（自动建表、种子数据、
  实际落库的增删改查）没有在真实数据库上跑通，只经过编译与接口契约检查。

## 已知边界

- 没有鉴权与登录，`X-User-Key` 只是用来区分数据归属的占位做法。
- 行情为模拟数据，不接任何真实行情供应商。
- 前端没有做分页，自选股数量大时一次性返回。
- 没有写测试用例（Go 单测与前端测试均未包含）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`stock-watching--minimax-m3-1-flash-preview-max-r01`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：fullstack；预览：none；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=stock-watching)
- 输入记录：用户指令、覆盖范围确认与任务正文 v1 原文均已完整留存，无图片、附件或历史上下文。任务正文提到「基于项目原型图」，但该原型图未随本轮输入提供，本轮按文字描述自行设计信息架构。
- 工具：Claude Code（当前会话）。模型 MiniMax M3.1 Flash Preview，推理档位 max，单会话直接执行，未委派子代理。已验证：go build / go vet / gofmt 通过，go run 启动后 CORS 头、请求 ID、参数校验（备注超长、缺少必填、id 非法）、统一错误结构、预检请求、数据库缺失时的 503 与前后端日志均按预期输出；前端 vite build 通过，并用真实浏览器验证了「后端不可用」告警与通信日志面板。测试环境没有可用的 PostgreSQL 实例，因此带数据库的读写链路（自动建表、种子数据、自选股 CRUD 的实际落库）未在真实库上跑通，这部分只经过编译与接口契约检查。
- 运行方式：无静态预览，参见上方历史说明与源码。


### 部署适配记录

- 行情数据：任务正文未指定行情来源，这里抽象出 service.QuoteProvider 接口并提供 SimulatedProvider 实现（按「代码 + 15 秒时间桶」确定性生成价格，同一时刻多次请求一致、随时间自然变化），响应中带 source 字段标明来源。接真实行情只需新增一个实现并切换 QUOTE_MODE，handler 与前端不改。
- 后端不可用时的行为：数据库连不上时服务不退出，仍监听端口并以只读模式启动，数据库相关接口统一返回 503 与 {code, message, fields} 结构；/api/v1/health 返回 status=degraded，前端据此展示「后端降级」。
- 错误对象改为不可变：包级 ErrXxx 作为只读模板，WithField / WithCause 返回副本，避免并发请求之间互相污染 fields（初版直接改共享对象，实测出现跨请求串字段）。
- 前端补充网关错误识别：Vite dev proxy 与反向代理在后端宕机时返回的是代理自己的 5xx（不含后端的 error.code），前端据此判定为「后端不可用」而不是普通业务错误。
- 归档来源：F:\dev\ai-coding-demo-test（model-test-base 分支）中的 demos/stock-watching/runs/minimax-m3-1-flash-preview-max-r01；保留该测试轮号。
<!-- archive:end -->
