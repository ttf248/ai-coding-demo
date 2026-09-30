# 自选股 API

Go 1.23+，Gin、GORM、PostgreSQL。单用户本地 demo，无账号系统。报价为明确标记的模拟数据，未接入行情供应商。

1. 在实验根目录执行 `docker compose up -d postgres`，也可使用本机 PostgreSQL。
2. 在本目录设置环境变量。PowerShell：

```powershell
$env:DATABASE_URL='postgres://demo:demo@127.0.0.1:5432/stockwatch?sslmode=disable'
$env:CORS_ORIGINS='http://localhost:5173,http://127.0.0.1:5173'
go mod download
go run .
```

自动创建 contracts 表。`LISTEN_ADDR` 默认 `127.0.0.1:8080`。数据持久化到 PostgreSQL；新数据库没有自选股，前端可新增。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | /api/health | 检查数据库连接 |
| GET | /api/contracts?market=CN&q=600 | 市场/名称/代码查询，最多 500 条 |
| GET | /api/contracts/:id | 合约与模拟报价 |
| POST | /api/contracts | 新增合约 |
| PATCH | /api/contracts/:id | 修改提供的字段 |
| DELETE | /api/contracts/:id | 删除，204 无响应正文 |

新增 JSON 示例：`{"market":"CN","symbol":"600519","name":"贵州茅台","note":"观察"}`。market 仅 CN/HK/US；symbol 转大写，1–24 个字母、数字、点、短横线；name 1–80 字；note 最多 240 字。同市场代码唯一，重复返回 409；参数错误 400，不存在 404，数据库错误 503。成功 JSON 为 `{data: ...}`，错误为 `{error:{message},requestId}`。报价包含 price、change、changePercent、volume、currency、timestamp 和 source=simulated。

前后端输出通讯日志，请求和响应关联 X-Request-ID。日志含 demo 合约正文，响应正文最多 8 KiB；请求体上限 1 MiB。不输出 DATABASE_URL。CORS 使用显式来源列表；对外部署由维护者另行配置。
