// Package handler 实现 HTTP 接口：健康检查、市场与代码、自选股 CRUD、行情查询。
package handler

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"stockwatch/backend/internal/apperr"
	"stockwatch/backend/internal/models"
	"stockwatch/backend/internal/repository"
	"stockwatch/backend/internal/service"
)

const maxNoteLength = 200

// Handler 聚合依赖。
type Handler struct {
	repo   *repository.Repository
	quotes service.QuoteProvider
	ready  func() error
}

// New 构造 Handler。ready 用于健康检查里探测数据库。
func New(repo *repository.Repository, quotes service.QuoteProvider) *Handler {
	return &Handler{repo: repo, quotes: quotes, ready: repo.Ping}
}

// Register 挂载全部路由。
func (h *Handler) Register(r *gin.Engine) {
	api := r.Group("/api/v1")
	{
		api.GET("/health", h.Health)
		api.GET("/markets", h.ListMarkets)
		api.GET("/markets/:marketCode/symbols", h.ListSymbols)
		api.GET("/watchlist", h.ListWatchlist)
		api.POST("/watchlist", h.CreateWatchItem)
		api.PUT("/watchlist/:id", h.UpdateWatchItem)
		api.DELETE("/watchlist/:id", h.DeleteWatchItem)
		api.GET("/quotes", h.ListQuotes)
	}
}

// ---------- 响应工具 ----------

func ok(c *gin.Context, data any) {
	reqID, _ := c.Get("requestId")
	c.JSON(http.StatusOK, gin.H{"requestId": reqID, "data": data})
}

func fail(c *gin.Context, err error) {
	e := apperr.From(err)
	reqID, _ := c.Get("requestId")
	if e.Status >= 500 {
		// 5xx 记录底层原因，便于排查
		c.Error(e) //nolint:errcheck // 交给 gin 的 ErrorLogger 处理
	}
	c.JSON(e.Status, gin.H{"requestId": reqID, "error": e})
}

// userKey 取请求头中的用户标识；缺省用 "demo" 便于本地试用。
func userKey(c *gin.Context) string {
	if v := strings.TrimSpace(c.GetHeader("X-User-Key")); v != "" {
		return v
	}
	return "demo"
}

func parseID(c *gin.Context) (uint, error) {
	raw := c.Param("id")
	id, err := strconv.ParseUint(raw, 10, 32)
	if err != nil || id == 0 {
		return 0, apperr.ErrInvalidInput.WithField("id", "id 必须是正整数")
	}
	return uint(id), nil
}

// ---------- 健康检查 ----------

// Health 返回服务与数据库状态，前端据此判断后端是否可用。
func (h *Handler) Health(c *gin.Context) {
	status := "ok"
	code := http.StatusOK
	dbStatus := "up"
	if err := h.ready(); err != nil {
		status, dbStatus, code = "degraded", "down", http.StatusServiceUnavailable
	}
	c.JSON(code, gin.H{
		"requestId": c.GetString("requestId"),
		"data": gin.H{
			"status":     status,
			"database":   dbStatus,
			"quoteMode":  h.quotes.Name(),
			"serverTime": time.Now().UTC().Format(time.RFC3339),
		},
	})
}

// ---------- 市场与代码 ----------

func (h *Handler) ListMarkets(c *gin.Context) {
	markets, err := h.repo.ListMarkets()
	if err != nil {
		fail(c, err)
		return
	}
	ok(c, markets)
}

func (h *Handler) ListSymbols(c *gin.Context) {
	symbols, err := h.repo.ListSymbols(c.Param("marketCode"))
	if err != nil {
		fail(c, err)
		return
	}
	ok(c, symbols)
}

// ---------- 自选股 ----------

// ListWatchlist GET /api/v1/watchlist?market=CN
func (h *Handler) ListWatchlist(c *gin.Context) {
	market := strings.TrimSpace(c.Query("market"))
	keyword := strings.TrimSpace(c.Query("q"))
	items, err := h.repo.ListWatchItems(userKey(c), market)
	if err != nil {
		fail(c, err)
		return
	}
	if keyword != "" {
		kw := strings.ToLower(keyword)
		filtered := items[:0]
		for _, it := range items {
			if strings.Contains(strings.ToLower(it.Symbol.Code), kw) ||
				strings.Contains(strings.ToLower(it.Symbol.Name), kw) ||
				strings.Contains(strings.ToLower(it.Note), kw) {
				filtered = append(filtered, it)
			}
		}
		items = filtered
	}
	ok(c, gin.H{"items": items, "total": len(items)})
}

// CreateWatchItem POST /api/v1/watchlist
func (h *Handler) CreateWatchItem(c *gin.Context) {
	var req models.CreateWatchItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		fail(c, apperr.ErrInvalidInput.WithCause(err).WithField("body", "请求体格式不正确"))
		return
	}
	if err := validateCreate(&req); err != nil {
		fail(c, err)
		return
	}
	symbol, _, err := h.repo.FindSymbol(req.MarketCode, req.SymbolCode)
	if err != nil {
		fail(c, err)
		return
	}
	item, err := h.repo.CreateWatchItem(models.WatchItem{
		UserKey:    userKey(c),
		SymbolID:   symbol.ID,
		Note:       strings.TrimSpace(req.Note),
		AlertPrice: req.AlertPrice,
		SortOrder:  valueOr(req.SortOrder, 0),
	})
	if err != nil {
		fail(c, err)
		return
	}
	c.Header("Location", "/api/v1/watchlist/"+strconv.FormatUint(uint64(item.ID), 10))
	c.JSON(http.StatusCreated, gin.H{"requestId": c.GetString("requestId"), "data": item})
}

func validateCreate(req *models.CreateWatchItemRequest) error {
	e := apperr.ErrInvalidInput
	if strings.TrimSpace(req.MarketCode) == "" {
		return e.WithField("marketCode", "市场代码不能为空")
	}
	if strings.TrimSpace(req.SymbolCode) == "" {
		return e.WithField("symbolCode", "代码不能为空")
	}
	if len([]rune(req.Note)) > maxNoteLength {
		return e.WithField("note", "备注不能超过 200 字")
	}
	if req.AlertPrice != nil && *req.AlertPrice < 0 {
		return e.WithField("alertPrice", "提醒价不能为负")
	}
	if req.SortOrder != nil && *req.SortOrder < 0 {
		return e.WithField("sortOrder", "排序值不能为负")
	}
	return nil
}

// UpdateWatchItem PUT /api/v1/watchlist/:id
func (h *Handler) UpdateWatchItem(c *gin.Context) {
	id, err := parseID(c)
	if err != nil {
		fail(c, err)
		return
	}
	var req models.UpdateWatchItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		fail(c, apperr.ErrInvalidInput.WithCause(err).WithField("body", "请求体格式不正确"))
		return
	}
	if req.Note != nil && len([]rune(*req.Note)) > maxNoteLength {
		fail(c, apperr.ErrInvalidInput.WithField("note", "备注不能超过 200 字"))
		return
	}
	if req.AlertPrice != nil && *req.AlertPrice < 0 {
		fail(c, apperr.ErrInvalidInput.WithField("alertPrice", "提醒价不能为负"))
		return
	}
	if req.SortOrder != nil && *req.SortOrder < 0 {
		fail(c, apperr.ErrInvalidInput.WithField("sortOrder", "排序值不能为负"))
		return
	}
	item, err := h.repo.UpdateWatchItem(userKey(c), id, req.Note, req.AlertPrice, req.ClearAlert, req.SortOrder)
	if err != nil {
		fail(c, err)
		return
	}
	ok(c, item)
}

// DeleteWatchItem DELETE /api/v1/watchlist/:id
func (h *Handler) DeleteWatchItem(c *gin.Context) {
	id, err := parseID(c)
	if err != nil {
		fail(c, err)
		return
	}
	if err := h.repo.DeleteWatchItem(userKey(c), id); err != nil {
		fail(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

// ---------- 行情 ----------

// ListQuotes GET /api/v1/quotes?market=CN 或 ?codes=600519,000858
func (h *Handler) ListQuotes(c *gin.Context) {
	marketCode := strings.TrimSpace(c.Query("market"))
	codes := parseCodes(c.Query("codes"))
	if marketCode == "" && len(codes) == 0 {
		fail(c, apperr.ErrInvalidInput.WithField("market", "market 与 codes 至少提供一个"))
		return
	}

	var symbols []models.Symbol
	var err error
	switch {
	case len(codes) > 0 && marketCode != "":
		for _, code := range codes {
			sym, _, e := h.repo.FindSymbol(marketCode, code)
			if e != nil {
				err = e
				break
			}
			symbols = append(symbols, sym)
		}
	case len(codes) > 0:
		symbols, err = h.repo.ListSymbols("")
		if err == nil {
			symbols = filterByCodes(symbols, codes)
		}
	default:
		symbols, err = h.repo.ListSymbols(marketCode)
	}
	if err != nil {
		fail(c, err)
		return
	}
	if len(symbols) == 0 {
		fail(c, apperr.ErrNotFound.WithField("codes", "没有匹配的代码"))
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()
	quotes, err := h.quotes.Fetch(ctx, symbols)
	if err != nil {
		fail(c, apperr.ErrUnavailable.WithCause(err))
		return
	}

	// 补上市场与币种
	byID := map[uint]models.Market{}
	markets, _ := h.repo.ListMarkets()
	for _, m := range markets {
		byID[m.ID] = m
	}
	for i := range quotes {
		for _, s := range symbols {
			if s.ID == quotes[i].SymbolID {
				if m, ok := byID[s.MarketID]; ok {
					quotes[i].MarketCode = m.Code
					quotes[i].Currency = m.Currency
				}
				break
			}
		}
	}
	ok(c, gin.H{"quotes": quotes, "source": h.quotes.Name(), "count": len(quotes)})
}

func parseCodes(raw string) []string {
	if strings.TrimSpace(raw) == "" {
		return nil
	}
	parts := strings.Split(raw, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		if p = strings.TrimSpace(p); p != "" {
			out = append(out, p)
		}
	}
	return out
}

func filterByCodes(list []models.Symbol, codes []string) []models.Symbol {
	want := make(map[string]bool, len(codes))
	for _, c := range codes {
		want[strings.ToUpper(c)] = true
	}
	out := list[:0]
	for _, s := range list {
		if want[strings.ToUpper(s.Code)] {
			out = append(out, s)
		}
	}
	return out
}

func valueOr(v *int, def int) int {
	if v == nil {
		return def
	}
	return *v
}
