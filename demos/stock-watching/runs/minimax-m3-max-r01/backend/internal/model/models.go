package model

import (
	"time"

	"github.com/shopspring/decimal"
)

type User struct {
	ID          uint64    `gorm:"primaryKey" json:"id"`
	Email       string    `gorm:"size:120;uniqueIndex" json:"email"`
	DisplayName string    `gorm:"size:60" json:"display_name"`
	CreatedAt   time.Time `json:"created_at"`
}

type Market struct {
	ID       uint64 `gorm:"primaryKey" json:"id"`
	Code     string `gorm:"size:8;uniqueIndex" json:"code"`
	Name     string `gorm:"size:60" json:"name"`
	Currency string `gorm:"size:8" json:"currency"`
	Timezone string `gorm:"size:32" json:"timezone"`
}

type Stock struct {
	ID        uint64 `gorm:"primaryKey" json:"id"`
	MarketID  uint64 `gorm:"index" json:"market_id"`
	Market    Market `gorm:"foreignKey:MarketID" json:"market,omitempty"`
	Code      string `gorm:"size:16" json:"code"`
	Name      string `gorm:"size:120" json:"name"`
}

type Watchlist struct {
	ID          uint64           `gorm:"primaryKey" json:"id"`
	UserID      uint64           `gorm:"index" json:"user_id"`
	StockID     uint64           `gorm:"index" json:"stock_id"`
	Stock       Stock            `gorm:"foreignKey:StockID" json:"stock,omitempty"`
	Note        string           `gorm:"size:240" json:"note"`
	TargetPrice *decimal.Decimal `gorm:"type:numeric(12,2)" json:"target_price,omitempty"`
	CreatedAt   time.Time        `json:"created_at"`
}

type PriceSnapshot struct {
	ID         uint64          `gorm:"primaryKey" json:"id"`
	StockID    uint64          `gorm:"index:idx_stock_time,priority:1" json:"stock_id"`
	Price      decimal.Decimal `gorm:"type:numeric(12,2)" json:"price"`
	ChangePct  decimal.Decimal `gorm:"type:numeric(8,4)" json:"change_pct"`
	RecordedAt time.Time       `gorm:"index:idx_stock_time,priority:2" json:"recorded_at"`
}