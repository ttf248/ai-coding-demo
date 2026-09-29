package controllers

import (
	"errors"
	"log"
	"strconv"
	"strings"

	"stock-watching/database"
	"stock-watching/models"
	"stock-watching/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// 支持的市场
var SUPPORTED_MARKETS = map[string]bool{
	"US": true, // 美股
	"HK": true, // 港股
	"SH": true, // 上证 A 股
	"SZ": true, // 深证 A 股
	"BJ": true, // 北证 A 股
}

// errResp 统一错误响应
func errResp(c *gin.Context, status int, msg string) {
	c.JSON(status, gin.H{"error": msg})
}

// GetStocks 获取自选股列表
// GET /api/stocks?market=US&code=AAPL
func GetStocks(c *gin.Context) {
	q := database.DB.Model(&models.Stock{})

	if market := strings.ToUpper(strings.TrimSpace(c.Query("market"))); market != "" {
		if !SUPPORTED_MARKETS[market] {
			errResp(c, 400, "不支持的市场代码: "+market)
			return
		}
		q = q.Where("market = ?", market)
	}
	if code := strings.TrimSpace(c.Query("code")); code != "" {
		q = q.Where("code LIKE ?", "%"+code+"%")
	}
	if name := strings.TrimSpace(c.Query("name")); name != "" {
		q = q.Where("name LIKE ?", "%"+name+"%")
	}

	var stocks []models.Stock
	if err := q.Order("updated_at DESC").Find(&stocks).Error; err != nil {
		log.Printf("[GetStocks] 查询失败: %v", err)
		errResp(c, 500, "查询自选股失败")
		return
	}

	c.JSON(200, gin.H{
		"data":  stocks,
		"total": len(stocks),
	})
}

// CreateStock 新增自选股
// POST /api/stocks { code, name, market, price?, changePercent? }
func CreateStock(c *gin.Context) {
	var input struct {
		Code          string  `json:"code" binding:"required"`
		Name          string  `json:"name" binding:"required"`
		Market        string  `json:"market" binding:"required"`
		Price         float64 `json:"price"`
		ChangePercent float64 `json:"changePercent"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		errResp(c, 400, "请求体无效: "+err.Error())
		return
	}

	input.Market = strings.ToUpper(strings.TrimSpace(input.Market))
	input.Code = strings.ToUpper(strings.TrimSpace(input.Code))
	input.Name = strings.TrimSpace(input.Name)

	if !SUPPORTED_MARKETS[input.Market] {
		errResp(c, 400, "不支持的市场代码: "+input.Market)
		return
	}
	if input.Code == "" || input.Name == "" {
		errResp(c, 400, "代码和名称不能为空")
		return
	}

	// 查重：同 (market, code) 视为重复
	var dup models.Stock
	err := database.DB.Where("market = ? AND code = ?", input.Market, input.Code).First(&dup).Error
	if err == nil {
		errResp(c, 409, "已存在相同的自选股")
		return
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("[CreateStock] 查询重复失败: %v", err)
		errResp(c, 500, "新增失败")
		return
	}

	// 未提供价格或涨跌幅时，使用模拟数据
	stock := models.Stock{
		Code:          input.Code,
		Name:          input.Name,
		Market:        input.Market,
		Price:         input.Price,
		ChangePercent: input.ChangePercent,
	}
	if stock.Price == 0 && stock.ChangePercent == 0 {
		tick := utils.GenerateTick(input.Market, input.Code)
		stock.Price = tick.Price
		stock.ChangePercent = tick.ChangePercent
	}

	if err := database.DB.Create(&stock).Error; err != nil {
		log.Printf("[CreateStock] 新增失败: %v", err)
		errResp(c, 500, "新增失败")
		return
	}

	log.Printf("[CreateStock] 新增成功 id=%d market=%s code=%s", stock.ID, stock.Market, stock.Code)
	c.JSON(201, stock)
}

// UpdateStock 修改自选股
// PUT /api/stocks/:id  { code?, name?, market?, price?, changePercent? }
func UpdateStock(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || id == 0 {
		errResp(c, 400, "无效的 ID")
		return
	}

	var stock models.Stock
	if err := database.DB.First(&stock, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			errResp(c, 404, "自选股不存在")
			return
		}
		log.Printf("[UpdateStock] 查询失败: %v", err)
		errResp(c, 500, "查询失败")
		return
	}

	var input struct {
		Code          *string  `json:"code"`
		Name          *string  `json:"name"`
		Market        *string  `json:"market"`
		Price         *float64 `json:"price"`
		ChangePercent *float64 `json:"changePercent"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		errResp(c, 400, "请求体无效: "+err.Error())
		return
	}

	if input.Code != nil {
		v := strings.ToUpper(strings.TrimSpace(*input.Code))
		if v == "" {
			errResp(c, 400, "代码不能为空")
			return
		}
		stock.Code = v
	}
	if input.Name != nil {
		v := strings.TrimSpace(*input.Name)
		if v == "" {
			errResp(c, 400, "名称不能为空")
			return
		}
		stock.Name = v
	}
	if input.Market != nil {
		v := strings.ToUpper(strings.TrimSpace(*input.Market))
		if !SUPPORTED_MARKETS[v] {
			errResp(c, 400, "不支持的市场代码: "+v)
			return
		}
		stock.Market = v
	}
	if input.Price != nil {
		stock.Price = *input.Price
	}
	if input.ChangePercent != nil {
		stock.ChangePercent = *input.ChangePercent
	}

	if err := database.DB.Save(&stock).Error; err != nil {
		log.Printf("[UpdateStock] 更新失败: %v", err)
		errResp(c, 500, "更新失败")
		return
	}

	log.Printf("[UpdateStock] 更新成功 id=%d", stock.ID)
	c.JSON(200, stock)
}

// DeleteStock 删除单条自选股
// DELETE /api/stocks/:id
func DeleteStock(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || id == 0 {
		errResp(c, 400, "无效的 ID")
		return
	}

	res := database.DB.Delete(&models.Stock{}, id)
	if res.Error != nil {
		log.Printf("[DeleteStock] 删除失败: %v", res.Error)
		errResp(c, 500, "删除失败")
		return
	}
	if res.RowsAffected == 0 {
		errResp(c, 404, "自选股不存在")
		return
	}

	log.Printf("[DeleteStock] 删除成功 id=%d", id)
	c.JSON(200, gin.H{"message": "删除成功", "id": id})
}

// DeleteAllStocks 批量删除
// DELETE /api/stocks[?market=US]
func DeleteAllStocks(c *gin.Context) {
	q := database.DB.Model(&models.Stock{})
	market := strings.ToUpper(strings.TrimSpace(c.Query("market")))
	if market != "" {
		if !SUPPORTED_MARKETS[market] {
			errResp(c, 400, "不支持的市场代码: "+market)
			return
		}
		q = q.Where("market = ?", market)
	}

	res := q.Delete(&models.Stock{})
	if res.Error != nil {
		log.Printf("[DeleteAllStocks] 批量删除失败: %v", res.Error)
		errResp(c, 500, "批量删除失败")
		return
	}

	log.Printf("[DeleteAllStocks] 批量删除成功 affected=%d market=%s", res.RowsAffected, market)
	c.JSON(200, gin.H{
		"message":      "删除成功",
		"rowsAffected": res.RowsAffected,
	})
}