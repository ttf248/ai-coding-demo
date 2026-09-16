package main

import (
	"log"
	"math/rand"
	"time"

	"trae/database"
	"trae/routes"
)

func main() {
	// 初始化随机数生成器
	rand.New(rand.NewSource(time.Now().UnixNano()))

	// 初始化数据库连接
	database.InitDB()

	// 设置路由
	r := routes.SetupRouter()

	// 启动服务器
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("启动服务器失败: %v", err)
	}
}
