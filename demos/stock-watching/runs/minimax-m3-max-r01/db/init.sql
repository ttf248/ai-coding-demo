-- 自选股小系统 · 数据库初始化
-- 适用于 PostgreSQL 14+ / SQLite（创建时调整 AUTOINCREMENT）

CREATE TABLE IF NOT EXISTS users (
    id           BIGSERIAL PRIMARY KEY,
    email        VARCHAR(120) NOT NULL UNIQUE,
    display_name VARCHAR(60)  NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS markets (
    id        BIGSERIAL PRIMARY KEY,
    code      VARCHAR(8)   NOT NULL UNIQUE,
    name      VARCHAR(60)  NOT NULL,
    currency  VARCHAR(8)   NOT NULL DEFAULT 'CNY',
    timezone  VARCHAR(32)  NOT NULL DEFAULT 'Asia/Shanghai'
);

CREATE TABLE IF NOT EXISTS stocks (
    id        BIGSERIAL PRIMARY KEY,
    market_id BIGINT NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
    code      VARCHAR(16) NOT NULL,
    name      VARCHAR(120) NOT NULL,
    UNIQUE (market_id, code)
);

CREATE TABLE IF NOT EXISTS watchlist (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stock_id     BIGINT NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    note         VARCHAR(240) DEFAULT '',
    target_price NUMERIC(12, 2),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, stock_id)
);

CREATE TABLE IF NOT EXISTS price_snapshots (
    id          BIGSERIAL PRIMARY KEY,
    stock_id    BIGINT NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    price       NUMERIC(12, 2) NOT NULL,
    change_pct  NUMERIC(8, 4)  NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_watchlist_user      ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_price_snapshots_rec ON price_snapshots(stock_id, recorded_at DESC);

-- 种子数据
INSERT INTO markets (code, name, currency, timezone) VALUES
    ('sh', '上交所', 'CNY', 'Asia/Shanghai'),
    ('sz', '深交所', 'CNY', 'Asia/Shanghai'),
    ('hk', '港交所', 'HKD', 'Asia/Hong_Kong'),
    ('us', '美股',   'USD', 'America/New_York')
ON CONFLICT DO NOTHING;

INSERT INTO stocks (market_id, code, name) VALUES
    ((SELECT id FROM markets WHERE code='sh'), '600519', '贵州茅台'),
    ((SELECT id FROM markets WHERE code='sh'), '601318', '中国平安'),
    ((SELECT id FROM markets WHERE code='sz'), '000001', '平安银行'),
    ((SELECT id FROM markets WHERE code='hk'), '00700',  '腾讯控股'),
    ((SELECT id FROM markets WHERE code='hk'), '09988',  '阿里巴巴-W'),
    ((SELECT id FROM markets WHERE code='us'), 'AAPL',   'Apple Inc.')
ON CONFLICT DO NOTHING;

INSERT INTO users (email, display_name) VALUES
    ('demo@example.com', '演示用户')
ON CONFLICT DO NOTHING;