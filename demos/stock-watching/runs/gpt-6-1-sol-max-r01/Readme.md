# 行情台 · 多市场自选股

## 本轮来源

用户指定 **gpt-6.1-sol / max**，明确允许当前会话。当前助手顺序执行，无子代理；模型名称来源为用户。完整用户要求与本题原文见 [prompt.md](prompt.md)。系统完整上下文、前序工具输出和历史缺失的材料未导出，输入标记 partial。

[批次说明](../../../../docs/experiments/gpt-6-1-sol-max/Readme.md) · [校验记录](../../../../docs/experiments/gpt-6-1-sol-max/validation.md) · [校验前首轮完整源码快照](../../../../docs/experiments/gpt-6-1-sol-max/first-complete-sources.zip)

这是一次当前会话的实现记录，不能视作独立会话下的公平性能评测。没有人工修改，所有实现期修复由当前助手完成。

## 功能与范围

支持 A 股 / 合约、港股、美股；合约新增、删除、编辑、查询、市场筛选和名称/代码搜索。详情包含价格、涨跌、演示成交量、走势与备注。后端不可用时显示告警，可手动重试；可显式切换到独立的本地演示模式，数据不会冒充 PostgreSQL 的结果。

全部行情明确为 mock，不接入真实报价或交易。任务引用的原型图未附于基线，本轮自行设计界面。

## 启动

需要 Go 1.24+、Node 22+ 和 PostgreSQL。已有 PostgreSQL 时新建 watchdesk 数据库；也可以在本目录运行 Docker Compose：

```sh
docker compose up -d db
```

在 PowerShell 终端启动后端：

```powershell
cd backend
$env:DATABASE_URL='postgres://watchdesk:watchdesk@127.0.0.1:5432/watchdesk?sslmode=disable'
$env:CORS_ORIGINS='http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:4174,http://localhost:4174'
go mod download
go run .
```

另一个终端启动前端：

```sh
cd frontend
npm ci
npm run dev
```

默认 http://127.0.0.1:5173。前端支持 VITE_API_URL，模板见 frontend/.env.example；默认后端 http://127.0.0.1:8080/api。后端不自动读取 .env，请使用 shell 导入环境变量。只绑定本机；PORT 可调整。

## API

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | /api/health | PostgreSQL 连接状态 |
| GET | /api/markets | 市场规则 |
| GET | /api/watchlist?market=CN&q=600 | 市场与字面量搜索（最多 500 条） |
| POST | /api/watchlist | 新增 |
| PUT | /api/watchlist/:id | 完整编辑 |
| DELETE | /api/watchlist/:id | 删除 |

请求示例：

```json
{"market":"CN","symbol":"600519","name":"贵州茅台","notes":"长期观察"}
```

规范化代码、校验市场、字段长度与格式；同市场代码唯一，重复为 409，无记录为 404，输入错误为 400，数据库不可用为 503。CORS 仅允许配置的来源；请求体限 1 MB。Gin middleware 输出 JSON 请求及响应日志（正文各最多 4096 字节）和 X-Request-ID；前端控制台打印通讯记录。

## 校验与部署

```sh
# 本目录（后端已启动，使用专用测试数据库）
node verification/api-check.mjs
# 前端
cd frontend
npm run build
# 后端
cd ../backend
go build .
```

API 检查仅创建与清理自己的验证记录，不清空数据库。本轮用临时 PostgreSQL 18.4 完成真实 CRUD、字面量 % 搜索、重复/非法输入、跨域和预检；浏览器也验证前端到数据库的新增、编辑、查询、删除与离线告警。Compose 的 PostgreSQL 16 配置未实际启动（本机无 Docker）。

全栈服务不能由 GitHub Pages 运行，因此 preview 为 none；保留完整源码、独立前端 lockfile、Go 依赖校验与启动说明。未登记未知外部地址，未修改 Vercel 配置。前端初次 JSX 标签错误已修复，390px 布局已检查。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`stock-watching--gpt-6-1-sol-max-r01`
- 模型：GPT-6.1 Sol；推理档位：max
- 类型：fullstack；预览：none；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=stock-watching)
- 输入记录：保存用户原始要求及基线任务正文；当前会话顺序执行。完整系统上下文与前序工具输出未导出，参见 docs/experiments/gpt-6-1-sol-max。
- 工具：Codex。用户指定 gpt-6.1-sol / max；当前会话直接执行，无子代理。Windows，Node 22.16.0，npm 10.9.2；日期按用户环境上下文。
- 运行方式：无静态预览，参见上方历史说明与源码。


### 部署适配记录

- 2026-09-30：从空白基线首次实现；按主题最新提示词执行，未获取历史实现。
- 2026-09-30：原型图缺失，当前助手自行设计；行情显式为 mock；实现期修复 JSX 自闭合标签，完成专用临时 PostgreSQL 与浏览器联调。
<!-- archive:end -->
