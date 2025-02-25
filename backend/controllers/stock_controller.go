package controllers

import (
	"fmt"
	"math/rand"

	"trae/database"
	"trae/models"
	"trae/utils"

	"github.com/gin-gonic/gin"
)

// GetStocks 获取股票列表
func GetStocks(c *gin.Context) {
	market := c.Query("market")
	if market == "" {
		c.JSON(400, gin.H{"error": "市场参数不能为空"})
		return
	}

	// 如果是沪深页面的请求，查询 SH、SZ、BJ 三个市场的数据
	var markets []string
	if market == "A" {
		markets = []string{"SH", "SZ", "BJ"}
	} else {
		markets = []string{market}
	}

	var stocks []models.Stock
	result := database.DB.Preload("PriceHistory").Where("market IN ?", markets).Find(&stocks)
	if result.Error != nil {
		c.JSON(500, gin.H{"error": "获取股票列表失败"})
		return
	}
	c.JSON(200, stocks)
}

// CreateStock 添加新股票
func CreateStock(c *gin.Context) {
	market := c.Query("market")
	if market == "" {
		c.JSON(400, gin.H{"error": "市场参数不能为空"})
		return
	}

	// 如果是沪深页面的请求，随机选择一个市场
	if market == "A" {
		markets := []string{"SH", "SZ", "BJ"}
		market = markets[rand.Intn(len(markets))]
	}

	// 生成UUID作为股票ID
	stockID := fmt.Sprintf("%08x-%04x-%04x-%04x-%012x",
		rand.Int31n(0x10000),
		rand.Int31n(0x10000),
		0x4000|rand.Int31n(0x1000),
		0x8000|rand.Int31n(0x4000),
		rand.Int63n(0x1000000000000))

	// 使用工具函数生成股票数据
	stock := models.Stock{
		ID:     stockID,
		Market: market,
		Code:   utils.GenerateStockCode(market),
		Name:   utils.GenerateStockName(market),
	}

	// 生成价格相关数据
	stock.Price, stock.Change, stock.ChangePercent = utils.GenerateStockPrice(market)

	// 生成历史价格数据
	priceHistory := utils.GeneratePriceHistory(stock.ID, stock.Price, market)

	// 开启事务
	tx := database.DB.Begin()
	if tx.Error != nil {
		c.JSON(500, gin.H{"error": "开启事务失败"})
		return
	}

	// 创建股票记录
	if err := tx.Create(&stock).Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "创建股票失败"})
		return
	}

	// 批量创建历史价格记录
	if err := tx.CreateInBatches(priceHistory, 100).Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "创建历史价格数据失败"})
		return
	}

	// 提交事务
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "提交事务失败"})
		return
	}
	c.JSON(201, stock)
}

// UpdateStock 更新股票信息
func UpdateStock(c *gin.Context) {
	id := c.Param("id")
	name := c.Query("name")
	code := c.Query("code")
	price := c.Query("price")
	change := c.Query("change")
	changePercent := c.Query("changePercent")

	// 构建更新数据
	updates := make(map[string]interface{})
	if name != "" {
		updates["name"] = name
	}
	if code != "" {
		updates["code"] = code
	}
	if price != "" {
		updates["price"] = price
	}
	if change != "" {
		updates["change"] = change
	}
	if changePercent != "" {
		updates["change_percent"] = changePercent
	}

	result := database.DB.Model(&models.Stock{}).Where("id = ?", id).Updates(updates)
	if result.Error != nil {
		c.JSON(500, gin.H{"error": "更新股票失败"})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(404, gin.H{"error": "股票不存在"})
		return
	}
	c.JSON(200, gin.H{"message": "更新成功"})
}

// DeleteStock 删除股票
func DeleteStock(c *gin.Context) {
	id := c.Query("id")

	// 开启事务
	tx := database.DB.Begin()
	if tx.Error != nil {
		c.JSON(500, gin.H{"error": "开启事务失败"})
		return
	}

	// 先删除历史价格数据
	if err := tx.Where("stock_id = ?", id).Delete(&models.PriceHistory{}).Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "删除历史价格数据失败"})
		return
	}

	// 再删除股票记录
	result := tx.Where("id = ?", id).Delete(&models.Stock{})
	if result.Error != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "删除股票失败"})
		return
	}
	if result.RowsAffected == 0 {
		tx.Rollback()
		c.JSON(404, gin.H{"error": "股票不存在"})
		return
	}

	// 提交事务
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "提交事务失败"})
		return
	}

	c.JSON(200, gin.H{"message": "删除成功"})
}
