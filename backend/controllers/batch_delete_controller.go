package controllers

import (
	"trae/database"
	"trae/models"

	"github.com/gin-gonic/gin"
)

// DeleteAllStocks 删除所有股票数据
func DeleteAllStocks(c *gin.Context) {
	// 开启事务
	tx := database.DB.Begin()
	if tx.Error != nil {
		c.JSON(500, gin.H{"error": "开启事务失败"})
		return
	}

	// 先删除所有历史价格数据
	if err := tx.Unscoped().Delete(&models.PriceHistory{}, "").Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "删除历史价格数据失败"})
		return
	}

	// 再删除所有股票记录
	if err := tx.Unscoped().Delete(&models.Stock{}, "").Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "删除股票数据失败"})
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

// DeleteMarketStocks 删除指定市场的所有股票数据
func DeleteMarketStocks(c *gin.Context) {
	market := c.Query("market")
	if market == "" {
		c.JSON(400, gin.H{"error": "市场参数不能为空"})
		return
	}

	// 如果是沪深页面的请求，删除 SH、SZ、BJ 三个市场的数据
	var markets []string
	if market == "A" {
		markets = []string{"SH", "SZ", "BJ"}
	} else {
		markets = []string{market}
	}

	// 开启事务
	tx := database.DB.Begin()
	if tx.Error != nil {
		c.JSON(500, gin.H{"error": "开启事务失败"})
		return
	}

	// 获取要删除的股票ID列表
	var stockIDs []string
	if err := tx.Model(&models.Stock{}).Where("market IN ?", markets).Pluck("id", &stockIDs).Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "获取股票ID失败"})
		return
	}

	// 如果没有找到任何股票
	if len(stockIDs) == 0 {
		c.JSON(200, gin.H{"message": "没有找到需要删除的数据"})
		return
	}

	// 删除历史价格数据
	if err := tx.Where("stock_id IN ?", stockIDs).Delete(&models.PriceHistory{}).Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "删除历史价格数据失败"})
		return
	}

	// 删除股票记录
	if err := tx.Where("market IN ?", markets).Delete(&models.Stock{}).Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "删除股票数据失败"})
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