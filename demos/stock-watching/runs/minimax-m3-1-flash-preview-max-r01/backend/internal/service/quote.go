// Package service 提供行情快照能力。
//
// 本示例不接入真实行情供应商：默认使用 SimulatedProvider，按「代码 + 时间桶」确定性地生成价格，
// 保证同一时刻多次请求结果一致、随时间自然变化。接入真实数据时只需实现 QuoteProvider 接口，
// 并把 QUOTE_MODE 切到对应实现即可，handler 与前端无需改动。
package service

import (
	"context"
	"hash/fnv"
	"math"
	"sync"
	"time"

	"stockwatch/backend/internal/models"
)

// QuoteProvider 是行情数据源接口。
type QuoteProvider interface {
	Name() string
	// Fetch 批量取行情；symbols 为空表示取该市场全部代码。
	Fetch(ctx context.Context, symbols []models.Symbol) ([]models.Quote, error)
}

// SimulatedProvider 生成模拟行情。
type SimulatedProvider struct {
	mu     sync.RWMutex
	bucket time.Duration
}

// NewSimulatedProvider 构造模拟行情源。bucket 决定价格刷新粒度，默认 15 秒。
func NewSimulatedProvider(bucket time.Duration) *SimulatedProvider {
	if bucket <= 0 {
		bucket = 15 * time.Second
	}
	return &SimulatedProvider{bucket: bucket}
}

func (p *SimulatedProvider) Name() string { return "simulated" }

// basePrice 由代码派生一个稳定的基准价，让同一代码在不同时间桶下围绕它波动。
func basePrice(code string) float64 {
	h := fnv.New32a()
	_, _ = h.Write([]byte(code))
	v := float64(h.Sum32()%4000)/100 + 8 // 8 ~ 48
	return math.Round(v*100) / 100
}

func (p *SimulatedProvider) Fetch(_ context.Context, symbols []models.Symbol) ([]models.Quote, error) {
	p.mu.RLock()
	bucket := p.bucket
	p.mu.RUnlock()

	now := time.Now().UTC()
	slot := now.Unix() / int64(bucket.Seconds())

	quotes := make([]models.Quote, 0, len(symbols))
	for _, s := range symbols {
		seed := float64(uint(s.ID)*7919 ^ uint(slot)*104729)
		drift := math.Sin(seed/97)*0.022 + math.Cos(seed/311)*0.011
		base := basePrice(s.Code)
		price := base * (1 + drift)
		open := base * (1 + math.Sin(seed/211)*0.006)
		high := math.Max(price, open) * (1 + math.Abs(math.Sin(seed/53))*0.008)
		low := math.Min(price, open) * (1 - math.Abs(math.Cos(seed/47))*0.008)
		change := price - open
		quotes = append(quotes, models.Quote{
			SymbolID:  s.ID,
			Code:      s.Code,
			Name:      s.Name,
			Price:     math.Round(price*100) / 100,
			Open:      math.Round(open*100) / 100,
			High:      math.Round(high*100) / 100,
			Low:       math.Round(low*100) / 100,
			Change:    math.Round(change*100) / 100,
			ChangePct: math.Round(change/open*10000) / 100,
			Volume:    int64(1_200_000 + math.Abs(math.Sin(seed/83))*8_000_000),
			Source:    p.Name(),
			UpdatedAt: now,
		})
	}
	return quotes, nil
}
