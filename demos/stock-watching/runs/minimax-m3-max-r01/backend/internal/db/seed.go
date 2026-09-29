package db

import (
	"gorm.io/gorm"

	"stock-watching-backend/internal/model"
)

func Seed(conn *gorm.DB) error {
	markets := []model.Market{
		{Code: "sh", Name: "上交所", Currency: "CNY", Timezone: "Asia/Shanghai"},
		{Code: "sz", Name: "深交所", Currency: "CNY", Timezone: "Asia/Shanghai"},
		{Code: "hk", Name: "港交所", Currency: "HKD", Timezone: "Asia/Hong_Kong"},
		{Code: "us", Name: "美股", Currency: "USD", Timezone: "America/New_York"},
	}
	for i := range markets {
		if err := conn.FirstOrCreate(&markets[i], model.Market{Code: markets[i].Code}).Error; err != nil {
			return err
		}
	}

	stockDefs := []struct {
		MarketCode string
		Code       string
		Name       string
	}{
		{"sh", "600519", "贵州茅台"},
		{"sh", "601318", "中国平安"},
		{"sz", "000001", "平安银行"},
		{"hk", "00700", "腾讯控股"},
		{"hk", "09988", "阿里巴巴-W"},
		{"us", "AAPL", "Apple Inc."},
	}
	for _, sd := range stockDefs {
		var m model.Market
		if err := conn.Where("code = ?", sd.MarketCode).First(&m).Error; err != nil {
			return err
		}
		s := model.Stock{MarketID: m.ID, Code: sd.Code, Name: sd.Name}
		if err := conn.FirstOrCreate(&s, model.Stock{MarketID: m.ID, Code: sd.Code}).Error; err != nil {
			return err
		}
	}

	u := model.User{Email: "demo@example.com", DisplayName: "演示用户"}
	return conn.FirstOrCreate(&u, model.User{Email: u.Email}).Error
}