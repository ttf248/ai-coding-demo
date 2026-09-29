package models

import "time"

// Stock 自选股模型
// 简化版（参考 demo 要求）：ID 为数字主键，仅维护基础行情字段
type Stock struct {
	ID            uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Code          string    `json:"code" gorm:"size:32;index;uniqueIndex:idx_market_code" binding:"required"`
	Name          string    `json:"name" gorm:"size:128" binding:"required"`
	Market        string    `json:"market" gorm:"size:16;index" binding:"required,oneof=US HK SH SZ BJ"`
	Price         float64   `json:"price"`
	ChangePercent float64   `json:"changePercent"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

// TableName 表名
func (Stock) TableName() string {
	return "stocks"
}

// StockUpdate 用于更新时的可选字段
type StockUpdate struct {
	Code          *string  `json:"code"`
	Name          *string  `json:"name"`
	Market        *string  `json:"market"`
	Price         *float64 `json:"price"`
	ChangePercent *float64 `json:"changePercent"`
}

// StockTick 单条行情快照（来自 utils 模拟生成）
type StockTick struct {
	Price         float64
	ChangePercent float64
}