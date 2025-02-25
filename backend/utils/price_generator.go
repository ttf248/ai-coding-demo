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

	// 生成市场波动趋势（-1到1之间的随机数，用于模拟整体市场趋势）
	marketTrend := rand.Float64()*2 - 1

	// 每天生成4个数据点
	for i := 0; i < 30*4; i++ {
		// 基础波动：-2%到2%之间的随机价格变动
		baseChange := rand.Float64()*0.04 - 0.02

		// 市场趋势影响：根据市场趋势调整波动方向
		trendEffect := marketTrend * (rand.Float64() * 0.01) // 最多1%的趋势影响

		// 随机波动性：有小概率出现较大波动
		volatility := 1.0
		if rand.Float64() < 0.1 { // 10%的概率出现大波动
			volatility = 2.0 // 放大波动范围
		}

		// 组合所有因素
		priceChange := currentPrice * (baseChange + trendEffect) * volatility
		currentPrice += priceChange

		// 确保价格不会太低
		if currentPrice < 1 {
			currentPrice = 1
		}

		// 添加一些随机时间间隔（5-7小时之间）
		timeOffset := time.Duration(5*3600+rand.Intn(7200)) * time.Second
		timestamp := baseTime.Add(time.Duration(i) * 6 * time.Hour).Add(timeOffset)

		history = append(history, models.PriceHistory{
			StockID:   stockID,
			Price:     currentPrice,
			Timestamp: timestamp,
		})
	}

	return history
}