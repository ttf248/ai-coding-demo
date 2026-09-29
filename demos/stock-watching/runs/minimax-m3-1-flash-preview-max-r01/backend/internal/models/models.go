// Package models 定义数据库实体与接口出入参。
package models

import "time"

// Market 是一个交易市场（例如 A 股、港股、美股）。
type Market struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Code      string    `gorm:"size:16;uniqueIndex;not null" json:"code"`
	Name      string    `gorm:"size:64;not null" json:"name"`
	Timezone  string    `gorm:"size:48;not null" json:"timezone"`
	Currency  string    `gorm:"size:8;not null" json:"currency"`
	SortOrder int       `gorm:"not null;default:0" json:"sortOrder"`
	CreatedAt time.Time `json:"createdAt"`
	Symbols   []Symbol  `gorm:"foreignKey:MarketID" json:"-"`
}

// Symbol 是某个市场下的一个可交易代码。
type Symbol struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	MarketID  uint      `gorm:"not null;index" json:"marketId"`
	Code      string    `gorm:"size:24;not null;uniqueIndex:idx_symbol_market_code" json:"code"`
	Name      string    `gorm:"size:64;not null" json:"name"`
	Sector    string    `gorm:"size:64" json:"sector"`
	CreatedAt time.Time `json:"createdAt"`
}

// WatchItem 是自选股条目。UserKey 用于区分不同使用者；本示例按请求头 X-User-Key 区分。
type WatchItem struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	UserKey    string    `gorm:"size:64;not null;index:idx_watch_user_symbol,unique" json:"userKey"`
	SymbolID   uint      `gorm:"not null;index:idx_watch_user_symbol,unique" json:"symbolId"`
	Note       string    `gorm:"size:200" json:"note"`
	AlertPrice *float64  `json:"alertPrice,omitempty"`
	SortOrder  int       `gorm:"not null;default:0" json:"sortOrder"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
	Symbol     Symbol    `gorm:"foreignKey:SymbolID" json:"symbol"`
	Market     Market    `gorm:"foreignKey:SymbolID->MarketID" json:"market"`
}

// Quote 是一次行情快照。真实环境下应由行情供应商返回。
type Quote struct {
	SymbolID   uint      `json:"symbolId"`
	Code       string    `json:"code"`
	Name       string    `json:"name"`
	MarketCode string    `json:"marketCode"`
	Currency   string    `json:"currency"`
	Price      float64   `json:"price"`
	Change     float64   `json:"change"`
	ChangePct  float64   `json:"changePct"`
	Open       float64   `json:"open"`
	High       float64   `json:"high"`
	Low        float64   `json:"low"`
	Volume     int64     `json:"volume"`
	Source     string    `json:"source"`
	UpdatedAt  time.Time `json:"updatedAt"`
}

// ---------- 请求 / 响应结构体 ----------

// CreateWatchItemRequest 新增自选股。
type CreateWatchItemRequest struct {
	MarketCode string   `json:"marketCode" binding:"required"`
	SymbolCode string   `json:"symbolCode" binding:"required"`
	Note       string   `json:"note"`
	AlertPrice *float64 `json:"alertPrice"`
	SortOrder  *int     `json:"sortOrder"`
}

// UpdateWatchItemRequest 修改自选股，所有字段可选。
type UpdateWatchItemRequest struct {
	Note       *string  `json:"note"`
	AlertPrice *float64 `json:"alertPrice"`
	ClearAlert bool     `json:"clearAlert"`
	SortOrder  *int     `json:"sortOrder"`
}

// ErrorBody 是统一的错误结构。
type ErrorBody struct {
	Code    string            `json:"code"`
	Message string            `json:"message"`
	Fields  map[string]string `json:"fields,omitempty"`
}
