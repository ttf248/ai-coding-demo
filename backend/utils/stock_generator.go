package utils

import (
	"fmt"
	"math/rand"
	"strings"
)

// 市场代码规则
var (
	marketRules = map[string]struct {
		codePrefix    string
		codeLength    int
		namePrefix    []string
		priceRange    [2]float64
		changeRange   [2]float64
		changePctRange [2]float64
	}{
		"SH": {
			codePrefix:    "60",
			codeLength:    6,
			namePrefix:    []string{"上海", "浦东", "申", "沪"},
			priceRange:    [2]float64{5.0, 100.0},
			changeRange:   [2]float64{-2.0, 2.0},
			changePctRange: [2]float64{-10.0, 10.0},
		},
		"SZ": {
			codePrefix:    "00",
			codeLength:    6,
			namePrefix:    []string{"深圳", "鹏", "深", "湾区"},
			priceRange:    [2]float64{3.0, 80.0},
			changeRange:   [2]float64{-1.5, 1.5},
			changePctRange: [2]float64{-8.0, 8.0},
		},
		"BJ": {
			codePrefix:    "8",
			codeLength:    6,
			namePrefix:    []string{"北交", "京", "北方", "首都"},
			priceRange:    [2]float64{10.0, 150.0},
			changeRange:   [2]float64{-3.0, 3.0},
			changePctRange: [2]float64{-12.0, 12.0},
		},
		"HK": {
			codePrefix:    "",
			codeLength:    4,
			namePrefix:    []string{"港", "香港", "恒", "九龙"},
			priceRange:    [2]float64{1.0, 500.0},
			changeRange:   [2]float64{-5.0, 5.0},
			changePctRange: [2]float64{-15.0, 15.0},
		},
		"US": {
			codePrefix:    "",
			codeLength:    4,
			namePrefix:    []string{"American", "US", "United", "Global"},
			priceRange:    [2]float64{10.0, 1000.0},
			changeRange:   [2]float64{-10.0, 10.0},
			changePctRange: [2]float64{-20.0, 20.0},
		},
	}

	// 行业名称列表
	industries = []string{"科技", "医药", "金融", "能源", "消费", "制造", "地产", "农业", "教育", "物流", "互联网", "半导体", "新能源", "人工智能", "区块链"}
	
	// 公司类型后缀
	companySuffixes = []string{"股份", "科技", "集团", "生物", "电子", "控股", "国际", "数字", "智能", "未来"}
)

// GenerateStockCode 生成指定市场的股票代码
func GenerateStockCode(market string) string {
	market = strings.ToUpper(market)
	rule, ok := marketRules[market]
	if !ok {
		return ""
	}

	// 特殊处理美股代码（2-4位字母）
	if market == "US" {
		length := rand.Intn(3) + 2 // 2-4位
		letters := make([]byte, length)
		for i := 0; i < length; i++ {
			letters[i] = byte('A' + rand.Intn(26))
		}
		return string(letters)
	}

	// 生成剩余数字部分
	remainLength := rule.codeLength - len(rule.codePrefix)
	remainNum := rand.Intn(int(pow10(remainLength)))
	
	// 格式化为指定长度的字符串
	return fmt.Sprintf("%s%0*d", rule.codePrefix, remainLength, remainNum)
}

// GenerateStockName 生成股票名称
func GenerateStockName(market string) string {
	rule, ok := marketRules[strings.ToUpper(market)]
	if !ok {
		return ""
	}

	// 随机选择前缀、行业和后缀
	prefix := rule.namePrefix[rand.Intn(len(rule.namePrefix))]
	industry := industries[rand.Intn(len(industries))]
	suffix := companySuffixes[rand.Intn(len(companySuffixes))]

	return prefix + industry + suffix
}

// GenerateStockPrice 生成股票价格和涨跌信息
func GenerateStockPrice(market string) (price, change, changePercent float64) {
	rule, ok := marketRules[strings.ToUpper(market)]
	if !ok {
		return 0, 0, 0
	}

	// 生成基础价格
	priceRange := rule.priceRange[1] - rule.priceRange[0]
	price = rule.priceRange[0] + rand.Float64()*priceRange

	// 生成涨跌额
	changeRange := rule.changeRange[1] - rule.changeRange[0]
	change = rule.changeRange[0] + rand.Float64()*changeRange

	// 计算涨跌幅
	changePercent = (change / (price - change)) * 100

	// 确保涨跌幅在合理范围内
	if changePercent < rule.changePctRange[0] {
		changePercent = rule.changePctRange[0]
	} else if changePercent > rule.changePctRange[1] {
		changePercent = rule.changePctRange[1]
	}

	// 四舍五入到小数点后两位
	price = float64(int(price*100)) / 100
	change = float64(int(change*100)) / 100
	changePercent = float64(int(changePercent*100)) / 100

	return
}

// pow10 返回10的n次方
func pow10(n int) int {
	result := 1
	for i := 0; i < n; i++ {
		result *= 10
	}
	return result
}