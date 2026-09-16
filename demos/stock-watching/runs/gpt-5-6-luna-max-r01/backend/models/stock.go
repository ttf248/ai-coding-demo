package models

import "time"

const (
	MarketCN = "CN"
	MarketHK = "HK"
	MarketUS = "US"
)

var Markets = map[string]string{
	MarketCN: "A 股",
	MarketHK: "港股",
	MarketUS: "美股",
}

type Stock struct {
	ID            string         `json:"id" gorm:"primaryKey"`
	Code          string         `json:"code"`
	Name          string         `json:"name"`
	Market        string         `json:"market"`
	Price         float64        `json:"price"`
	Change        float64        `json:"change"`
	ChangePercent float64        `json:"changePercent"`
	Volume        int64          `json:"volume"`
	CreatedAt     time.Time      `json:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt"`
	PriceHistory  []PriceHistory `json:"priceHistory,omitempty" gorm:"foreignKey:StockID"`
}

type PriceHistory struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	StockID       string    `json:"stockId"`
	OpenPrice     float64   `json:"openPrice"`
	HighPrice     float64   `json:"highPrice"`
	LowPrice      float64   `json:"lowPrice"`
	ClosePrice    float64   `json:"closePrice"`
	PreClosePrice float64   `json:"preClosePrice"`
	Volume        int64     `json:"volume"`
	Amount        float64   `json:"amount"`
	Timestamp     time.Time `json:"timestamp"`
}
