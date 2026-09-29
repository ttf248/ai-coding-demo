-- 自选股数据结构的参考 DDL。
-- 服务启动时会用 GORM AutoMigrate 自动建表，这份文件只用于人工审阅或在
-- 需要精确控制字段类型 / 索引时手工执行。

CREATE TABLE IF NOT EXISTS markets (
    id          SERIAL PRIMARY KEY,
    code        VARCHAR(16)  NOT NULL UNIQUE,
    name        VARCHAR(64)  NOT NULL,
    timezone    VARCHAR(48)  NOT NULL,
    currency    VARCHAR(8)   NOT NULL,
    sort_order  INTEGER      NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS symbols (
    id          SERIAL PRIMARY KEY,
    market_id   INTEGER      NOT NULL REFERENCES markets (id) ON DELETE CASCADE,
    code        VARCHAR(24)  NOT NULL,
    name        VARCHAR(64)  NOT NULL,
    sector      VARCHAR(64),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT idx_symbol_market_code UNIQUE (market_id, code)
);

CREATE INDEX IF NOT EXISTS idx_symbols_market_id ON symbols (market_id);

CREATE TABLE IF NOT EXISTS watch_items (
    id          SERIAL PRIMARY KEY,
    user_key    VARCHAR(64)   NOT NULL,
    symbol_id   INTEGER       NOT NULL REFERENCES symbols (id) ON DELETE CASCADE,
    note        VARCHAR(200),
    alert_price DOUBLE PRECISION,
    sort_order  INTEGER       NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    -- 同一用户不能重复添加同一代码
    CONSTRAINT idx_watch_user_symbol UNIQUE (user_key, symbol_id)
);

CREATE INDEX IF NOT EXISTS idx_watch_items_user ON watch_items (user_key, sort_order);
