# Stock Watching API

```sh
cp .env.example .env
go mod tidy
go run .
```

The service expects PostgreSQL, migrates the `contracts` table on startup, and exposes `/api/health`, `/api/markets`, and CRUD endpoints under `/api/contracts`. Gin logs requests while the structured logger records the completed exchange. CORS origins are controlled by `ALLOWED_ORIGINS`.
