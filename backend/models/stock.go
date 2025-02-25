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
	ID        uint      `json:"id" gorm:"primaryKey"`
	StockID   string    `json:"stockId"`
	Price     float64   `json:"price"`
	Timestamp time.Time `json:"timestamp"`
}