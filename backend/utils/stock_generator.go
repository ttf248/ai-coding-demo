package utils

import (
	"fmt"
	"github.com/brianvoe/gofakeit/v6"
	"github.com/montanaflynn/stats"
	"github.com/shopspring/decimal"
	"math/rand"
	"strings"
)



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
	// 使用 decimal 包确保精确计算
	basePrice := decimal.NewFromFloat(float64(20 + rand.Float64()*80))
	
	// 生成符合正态分布的价格变动
	data := make([]float64, 100)
	for i := range data {
		data[i] = rand.NormFloat64() * 2 // 标准差为2的正态分布
	}
	
	// 使用 stats 包计算统计数据
	mean, _ := stats.Mean(data)
	stdDev, _ := stats.StandardDeviation(data)
	
	// 生成基于统计特征的价格变动
	changeValue := decimal.NewFromFloat(mean * stdDev * 0.1)
	
	// 计算最终价格和变动百分比
	finalPrice := basePrice.Add(changeValue)
	changePercent = changeValue.Div(basePrice).Mul(decimal.NewFromInt(100)).InexactFloat64()
	
	return finalPrice.InexactFloat64(), changeValue.InexactFloat64(), changePercent
}