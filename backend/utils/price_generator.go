package utils

import (
	"math/rand"
	"time"

	"trae/models"
)

// GeneratePriceHistory 生成股票历史价格数据
func GeneratePriceHistory(stockID string, basePrice float64) []models.PriceHistory {
	// 生成过去30天的历史数据
	var history []models.PriceHistory
	baseTime := time.Now().Add(-30 * 24 * time.Hour)
	currentPrice := basePrice

	// 每天生成4个数据点
	for i := 0; i < 30*4; i++ {
		// 生成-2%到2%之间的随机价格变动
		priceChange := currentPrice * (rand.Float64()*0.04 - 0.02)
		currentPrice += priceChange

		// 确保价格不会太低
		if currentPrice < 1 {
			currentPrice = 1
		}

		history = append(history, models.PriceHistory{
			StockID:   stockID,
			Price:     currentPrice,
			Timestamp: baseTime.Add(time.Duration(i) * 6 * time.Hour),
		})
	}

	return history
}