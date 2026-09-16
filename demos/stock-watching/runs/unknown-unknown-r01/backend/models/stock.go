package models

import "time"

// Stock 股票模型
type Stock struct {
	ID            string         `json:"id" gorm:"primaryKey"`
	Code          string         `json:"code" binding:"required"`
	Name          string         `json:"name" binding:"required"`
	Price         float64        `json:"price"`
	Change        float64        `json:"change"`
	ChangePercent float64        `json:"changePercent"`
	Market        string         `json:"market"`
	CreatedAt     time.Time      `json:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt"`
	PriceHistory  []PriceHistory `json:"priceHistory" gorm:"foreignKey:StockID"`
}

// PriceHistory 价格历史记录模型
type PriceHistory struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	StockID       string    `json:"stockId"`
	OpenPrice     float64   `json:"openPrice"`     // 开盘价
	HighPrice     float64   `json:"highPrice"`     // 最高价
	LowPrice      float64   `json:"lowPrice"`      // 最低价
	ClosePrice    float64   `json:"closePrice"`    // 收盘价（最新价）
	PreClosePrice float64   `json:"preClosePrice"` // 昨收价
	Volume        int64     `json:"volume"`        // 成交量
	Amount        float64   `json:"amount"`        // 成交额
	Timestamp     time.Time `json:"timestamp"`
}