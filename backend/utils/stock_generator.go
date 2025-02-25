package utils

import (
	"fmt"
	"math/rand"
	"strings"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/shopspring/decimal"

	"trae/models"
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
	switch strings.ToUpper(market) {
	case "SH", "SZ", "BJ":
		// A股市场使用中文特征的公司名称
		industries := []string{"科技", "医药", "电子", "新能源", "金融", "地产", "汽车", "农业"}
		prefixes := []string{"中国", "国际", "东方", "西部", "北方", "南方", "华夏", "龙"}
		suffixes := []string{"股份", "科技", "集团", "控股", "发展", "实业"}
		return prefixes[rand.Intn(len(prefixes))] + industries[rand.Intn(len(industries))] + suffixes[rand.Intn(len(suffixes))]
	case "HK":
		// 港股使用双语特征的公司名称
		prefixes := []string{"香港", "恒", "长江", "粤海", "中华", "港"}
		industries := []string{"投资", "地产", "银行", "保险", "能源", "建设"}
		suffixes := []string{"企业", "集团", "实业", "控股"}
		return prefixes[rand.Intn(len(prefixes))] + industries[rand.Intn(len(industries))] + suffixes[rand.Intn(len(suffixes))]
	case "US":
		// 美股保持使用英文公司名称
		companyName := gofakeit.Company()
		name := strings.Split(companyName, "(")[0]
		if len(name) > 8 {
			name = name[:8]
		}
		return name
	default:
		return gofakeit.Company()
	}
}

// GeneratePriceHistory 生成股票历史价格数据
func GeneratePriceHistory(stockID string, basePrice float64, market string) []models.PriceHistory {
	config := getMarketConfig(market)
	var history []models.PriceHistory
	baseTime := time.Now().Add(-30 * 24 * time.Hour)
	currentPrice := basePrice

	// 生成市场波动趋势（-1到1之间的随机数，用于模拟整体市场趋势）
	marketTrend := rand.Float64()*2 - 1

	// 每天生成数据点数量根据市场特征调整
	dataPointsPerDay := 4
	if market == "US" {
		dataPointsPerDay = 6 // 美股交易时间更长
	} else if market == "HK" {
		dataPointsPerDay = 5 // 港股交易时间适中
	}

	// 生成历史数据
	for i := 0; i < 30*dataPointsPerDay; i++ {
		// 基础波动：根据市场特征调整波动范围
		baseChange := (rand.Float64()*0.04 - 0.02) * config.VolatilityFactor

		// 市场趋势影响：根据市场趋势调整波动方向
		trendEffect := marketTrend * (rand.Float64() * 0.01) * config.VolatilityFactor

		// 随机波动性：根据市场特征调整大波动概率
		volatility := 1.0
		if rand.Float64() < 0.1*config.VolatilityFactor/2 { // 波动率越高，出现大波动的概率越大
			volatility = 1.5 + rand.Float64()*config.VolatilityFactor // 波动范围也随市场特征调整
		}

		// 组合所有因素
		priceChange := currentPrice * (baseChange + trendEffect) * volatility
		currentPrice += priceChange

		// 确保价格在市场允许范围内
		if currentPrice < config.MinPrice {
			currentPrice = config.MinPrice
		} else if currentPrice > config.MaxPrice {
			currentPrice = config.MaxPrice
		}

		// 根据市场特征调整时间间隔
		baseHours := 24 / dataPointsPerDay
		timeOffset := time.Duration(baseHours*3600+rand.Intn(1800)) * time.Second // 添加最多30分钟的随机偏移
		timestamp := baseTime.Add(time.Duration(i) * time.Duration(baseHours) * time.Hour).Add(timeOffset)

		// 确保价格符合最小变动单位
		currentPrice = decimal.NewFromFloat(currentPrice).Round(3).InexactFloat64()

		history = append(history, models.PriceHistory{
			StockID:   stockID,
			Price:     currentPrice,
			Timestamp: timestamp,
		})
	}

	return history
}

// GenerateStockPrice 生成更真实的股票价格和变动
func GenerateStockPrice(market string) (price float64, change float64, changePercent float64) {
	config := getMarketConfig(market)

	// 生成基础价格，考虑市场特定范围
	basePrice := decimal.NewFromFloat(config.MinPrice + rand.Float64()*(config.MaxPrice-config.MinPrice))

	// 生成基础波动比例（-3%到3%之间）
	baseChangePercent := (rand.Float64()*0.06 - 0.03) * config.VolatilityFactor

	// 随机增加额外波动（20%概率）
	if rand.Float64() < 0.2 {
		extraVolatility := 2.0 + rand.Float64()*3.0 // 2-5倍额外波动
		baseChangePercent *= extraVolatility
	}

	// 计算价格变动值
	changeValue := basePrice.Mul(decimal.NewFromFloat(baseChangePercent))

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
