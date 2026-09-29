# 自选股实战 · 后端

Go + gin + gorm + Postgres/SQLite，提供自选股 CRUD 与行情查询 mock。

## 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `HTTP_ADDR` | `:8080` | 监听地址 |
| `DB_DRIVER` | `sqlite` | `sqlite` 或 `postgres` |
| `DB_DSN`    | `stock.db` | SQLite 文件名 / Postgres 连接串 |
| `CORS_ORIGINS` | `http://localhost:5173` | 允许的来源，逗号分隔 |
| `DB_SEED`  | `true` | 是否写入种子数据 |

## 本地运行

```sh
# 1. 启动数据库（可选 SQLite）
go run ./cmd/server

# 2. 启用 Postgres
DB_DRIVER=postgres DB_DSN="host=localhost user=postgres password=postgres dbname=stock port=5432 sslmode=disable" \
  go run ./cmd/server
```

## 接口

```
GET    /api/v1/markets
GET    /api/v1/stocks?market=hk
GET    /api/v1/stocks/:code/quote
GET    /api/v1/watchlist?user_id=1
POST   /api/v1/watchlist
PUT    /api/v1/watchlist/:id
DELETE /api/v1/watchlist/:id
GET    /api/v1/health
```

## 日志

每次请求都会打印 method / path / status / 耗时 + request id。