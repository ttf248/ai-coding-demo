package utils

import (
	"fmt"
	"math/rand"
	"strings"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/montanaflynn/stats"
	"github.com/shopspring/decimal"
)

// MarketConfig 定义不同市场的特征配置
type MarketConfig struct {
	MinPrice         float64
	MaxPrice         float64
	VolatilityFactor float64
	PriceStep        float64
}

// getMarketConfig 获取特定市场的配置
func getMarketConfig(market string) MarketConfig {
	switch strings.ToUpper(market) {
	case "SH":
		return MarketConfig{
			MinPrice:         2.00,    // 上交所最低价格
			MaxPrice:         9999.99, // 上交所最高价格
			VolatilityFactor: 2.5,     // 标准波动率
			PriceStep:        0.01,    // 价格最小变动单位
		}
	case "SZ":
		return MarketConfig{
			MinPrice:         1.00,   // 深交所最低价格
			MaxPrice:         999.99, // 深交所最高价格
			VolatilityFactor: 3.0,    // 相对更高的波动率
			PriceStep:        0.01,   // 价格最小变动单位
		}
	case "BJ":
		return MarketConfig{
			MinPrice:         1.00,   // 北交所最低价格
			MaxPrice:         200.00, // 北交所最高价格
			VolatilityFactor: 3.5,    // 最高波动率
			PriceStep:        0.01,   // 价格最小变动单位
		}
	case "HK":
		return MarketConfig{
			MinPrice:         0.01,    // 港股最低价格
			MaxPrice:         2000.00, // 港股最高价格
			VolatilityFactor: 3.2,     // 较高波动率
			PriceStep:        0.001,   // 价格最小变动单位
		}
	case "US":
		return MarketConfig{
			MinPrice:         0.01,    // 美股最低价格
			MaxPrice:         5000.00, // 美股最高价格
			VolatilityFactor: 3.8,     // 高波动率
			PriceStep:        0.01,    // 价格最小变动单位
		}
	default:
		return MarketConfig{
			MinPrice:         1.00,
			MaxPrice:         999.99,
			VolatilityFactor: 1.0,
			PriceStep:        0.01,
		}
	}
}

// GenerateStockCode 生成更真实的股票代码
func GenerateStockCode(market string) string {
	var prefix string
	switch strings.ToUpper(market) {
	case "SH":
		prefix = "60"
	case "SZ":
		prefix = "00"
	case "BJ":
		prefix = "83"
	case "HK":
		// 港股使用5位数字
		return fmt.Sprintf("%d", 1+rand.Intn(9999))
	case "US":
		// 美股使用字母加数字的格式
		letters := []string{"AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NVDA", "NFLX"}
		return letters[rand.Intn(len(letters))]
	default:
		prefix = "00"
	}
	return fmt.Sprintf("%s%04d", prefix, rand.Intn(10000))
}

// GenerateStockName 生成更真实的股票名称
func GenerateStockName(market string) string {
	// 使用 gofakeit 生成更真实的公司名称
	companyName := gofakeit.Company()
	// 移除括号内容并限制长度
	name := strings.Split(companyName, "(")[0]
	if len(name) > 8 {
		name = name[:8]
	}
	return name
}

// GenerateStockPrice 生成更真实的股票价格和变动
func GenerateStockPrice(market string) (price float64, change float64, changePercent float64) {
	config := getMarketConfig(market)

	// 生成基础价格，考虑市场特定范围
	basePrice := decimal.NewFromFloat(config.MinPrice + rand.Float64()*(config.MaxPrice-config.MinPrice))

	// 生成符合正态分布的价格变动，考虑市场特定波动率
	data := make([]float64, 100)
	for i := range data {
		data[i] = rand.NormFloat64() * config.VolatilityFactor
	}

	// 使用 stats 包计算统计数据
	mean, _ := stats.Mean(data)
	stdDev, _ := stats.StandardDeviation(data)

	// 生成基于统计特征的价格变动
	// 增加基准变动比例到 0.5，使价格波动更明显
	baseVolatility := 0.5
	changeValue := decimal.NewFromFloat(mean * stdDev * baseVolatility)

	// 随机增加额外波动
	if rand.Float64() < 0.2 { // 20%的概率出现更大波动
		extraVolatility := 2.0 + rand.Float64()*3.0 // 2-5倍额外波动
		changeValue = changeValue.Mul(decimal.NewFromFloat(extraVolatility))
	}

	// 计算最终价格，确保在市场允许范围内
	finalPrice := basePrice.Add(changeValue)
	if finalPrice.LessThan(decimal.NewFromFloat(config.MinPrice)) {
		finalPrice = decimal.NewFromFloat(config.MinPrice)
		changeValue = finalPrice.Sub(basePrice)
	} else if finalPrice.GreaterThan(decimal.NewFromFloat(config.MaxPrice)) {
		finalPrice = decimal.NewFromFloat(config.MaxPrice)
		changeValue = finalPrice.Sub(basePrice)
	}

	// 确保价格符合最小变动单位
	finalPrice = finalPrice.Round(2) // 保留两位小数
	changeValue = changeValue.Round(2)

	// 计算涨跌幅
	changePercent = changeValue.Div(basePrice).Mul(decimal.NewFromInt(100)).Round(2).InexactFloat64()

	return finalPrice.InexactFloat64(), changeValue.InexactFloat64(), changePercent
}
