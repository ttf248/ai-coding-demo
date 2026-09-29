package handler

import (
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"

	"stock-watching-backend/internal/config"
	"stock-watching-backend/internal/model"
)

type Handler struct {
	db  *gorm.DB
	cfg config.Config
}

func New(db *gorm.DB, cfg config.Config) *Handler {
	return &Handler{db: db, cfg: cfg}
}

func (h *Handler) ListMarkets(c *gin.Context) {
	var markets []model.Market
	if err := h.db.Order("code asc").Find(&markets).Error; err != nil {
		fail(c, http.StatusInternalServerError, "查询市场失败")
		return
	}
	ok(c, markets)
}

func (h *Handler) ListStocks(c *gin.Context) {
	market := c.Query("market")
	q := h.db.Preload("Market").Order("code asc")
	if market != "" {
		q = q.Joins("JOIN markets ON markets.id = stocks.market_id").
			Where("markets.code = ?", market)
	}
	var stocks []model.Stock
	if err := q.Find(&stocks).Error; err != nil {
		fail(c, http.StatusInternalServerError, "查询股票失败")
		return
	}
	ok(c, stocks)
}

func (h *Handler) StockQuote(c *gin.Context) {
	code := c.Param("code")
	var stock model.Stock
	if err := h.db.Preload("Market").Where("code = ?", code).First(&stock).Error; err != nil {
		fail(c, http.StatusNotFound, "找不到该股票")
		return
	}
	// mock 数据：随机生成价格和涨跌幅
	base := decimal.NewFromFloat(20 + float64(time.Now().Unix()%1000)/10.0)
	change := decimal.NewFromFloat(float64((time.Now().UnixNano()%2000)-1000) / 100.0)
	ok(c, gin.H{
		"stock":     stock,
		"price":     base,
		"change":    change,
		"timestamp": time.Now(),
	})
}

type WatchlistPayload struct {
	UserID      uint64           `json:"user_id" binding:"required"`
	StockID     uint64           `json:"stock_id" binding:"required"`
	Note        string           `json:"note"`
	TargetPrice *decimal.Decimal `json:"target_price"`
}

func (h *Handler) ListWatchlist(c *gin.Context) {
	userID, err := parseUint(c.Query("user_id"))
	if err != nil || userID == 0 {
		fail(c, http.StatusBadRequest, "缺少 user_id")
		return
	}
	var list []model.Watchlist
	if err := h.db.Preload("Stock.Market").Where("user_id = ?", userID).Order("created_at desc").Find(&list).Error; err != nil {
		fail(c, http.StatusInternalServerError, "查询自选股失败")
		return
	}
	ok(c, list)
}

func (h *Handler) CreateWatchlist(c *gin.Context) {
	var p WatchlistPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		fail(c, http.StatusBadRequest, "参数错误")
		return
	}
	item := model.Watchlist{
		UserID:      p.UserID,
		StockID:     p.StockID,
		Note:        p.Note,
		TargetPrice: p.TargetPrice,
	}
	if err := h.db.Create(&item).Error; err != nil {
		fail(c, http.StatusBadRequest, "新增失败（可能重复或参数错误）")
		return
	}
	ok(c, item)
}

func (h *Handler) UpdateWatchlist(c *gin.Context) {
	id, err := parseUint(c.Param("id"))
	if err != nil {
		fail(c, http.StatusBadRequest, "id 不合法")
		return
	}
	var p WatchlistPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		fail(c, http.StatusBadRequest, "参数错误")
		return
	}
	var item model.Watchlist
	if err := h.db.First(&item, id).Error; err != nil {
		fail(c, http.StatusNotFound, "记录不存在")
		return
	}
	item.Note = p.Note
	item.TargetPrice = p.TargetPrice
	if err := h.db.Save(&item).Error; err != nil {
		fail(c, http.StatusInternalServerError, "保存失败")
		return
	}
	ok(c, item)
}

func (h *Handler) DeleteWatchlist(c *gin.Context) {
	id, err := parseUint(c.Param("id"))
	if err != nil {
		fail(c, http.StatusBadRequest, "id 不合法")
		return
	}
	if err := h.db.Delete(&model.Watchlist{}, id).Error; err != nil {
		fail(c, http.StatusInternalServerError, "删除失败")
		return
	}
	ok(c, gin.H{"id": id})
}

func parseUint(s string) (uint64, error) {
	if s == "" {
		return 0, errors.New("empty")
	}
	return strconv.ParseUint(s, 10, 64)
}

func ok(c *gin.Context, data any) {
	c.JSON(http.StatusOK, gin.H{"code": 0, "message": "ok", "data": data})
}

func fail(c *gin.Context, status int, msg string) {
	c.JSON(status, gin.H{"code": status, "message": msg})
}