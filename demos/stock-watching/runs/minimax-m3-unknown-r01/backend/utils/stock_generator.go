package utils

import (
	"hash/fnv"
	"math"
	"math/rand"
	"strconv"
	"strings"

	"stock-watching/models"
)

// MarketConfig 不同市场的价格区间与波动率
type MarketConfig struct {
	MinPrice         float64
	MaxPrice         float64
	VolatilityFactor float64
	PriceStep        float64
}

// configFor 返回指定市场的配置
func configFor(market string) MarketConfig {
	switch strings.ToUpper(market) {
	case "US":
		return MarketConfig{MinPrice: 1, MaxPrice: 5000, VolatilityFactor: 3.5, PriceStep: 0.01}
	case "HK":
		return MarketConfig{MinPrice: 0.01, MaxPrice: 2000, VolatilityFactor: 3.0, PriceStep: 0.001}
	case "SH", "SZ":
		return MarketConfig{MinPrice: 2, MaxPrice: 999, VolatilityFactor: 2.5, PriceStep: 0.01}
	case "BJ":
		return MarketConfig{MinPrice: 1, MaxPrice: 200, VolatilityFactor: 3.5, PriceStep: 0.01}
	default:
		return MarketConfig{MinPrice: 1, MaxPrice: 999, VolatilityFactor: 1.0, PriceStep: 0.01}
	}
}

// GenerateTick 生成一条模拟行情快照（价格 + 涨跌幅 %）
// 用 code+market 哈希做 PRNG 种子，同一只股票在一次会话内价格相对稳定，
// 避免每次刷新都剧烈跳变。
func GenerateTick(market, code string) models.StockTick {
	cfg := configFor(market)

	seed := hashString(strings.ToUpper(market) + ":" + strings.ToUpper(code))
	r := rand.New(rand.NewSource(int64(seed)))

	basePrice := cfg.MinPrice + r.Float64()*(cfg.MaxPrice-cfg.MinPrice)
	pct := (r.Float64()*0.06 - 0.03) * cfg.VolatilityFactor // 基线 ±3%
	if r.Float64() < 0.2 {
		pct *= 2.0 + r.Float64()*3.0 // 20% 概率放大波动
	}

	change := basePrice * pct
	price := basePrice + change
	if price < cfg.MinPrice {
		price = cfg.MinPrice
		change = price - basePrice
	} else if price > cfg.MaxPrice {
		price = cfg.MaxPrice
		change = price - basePrice
	}

	return models.StockTick{
		Price:         roundTo(price, cfg.PriceStep),
		ChangePercent: roundTo(pct*100, 0.01),
	}
}

// ---- helpers ----

// hashString FNV-1a 32 位哈希
func hashString(s string) uint32 {
	h := fnv.New32a()
	_, _ = h.Write([]byte(s))
	return h.Sum32()
}

// roundTo 按最小变动单位四舍五入（默认保留两位小数）
func roundTo(v, step float64) float64 {
	if step <= 0 {
		return math.Round(v*100) / 100
	}
	return math.Round(v/step) * step
}

// padInt 左 0 补足到指定宽度（用于生成 A 股代码）
func padInt(n, width int) string {
	s := strconvItoa(n)
	for len(s) < width {
		s = "0" + s
	}
	return s
}

func strconvItoa(n int) string {
	return strconv.Itoa(n)
}