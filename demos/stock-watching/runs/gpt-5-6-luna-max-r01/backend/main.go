package main

import (
	"log"
	"os"

	"stock-watch-luna/database"
	"stock-watch-luna/routes"
)

func main() {
	db, err := database.Open()
	if err != nil {
		log.Fatalf("database initialization failed: %v", err)
	}

	router := routes.New(db)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("stock watch API listening on :%s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("server stopped: %v", err)
	}
}
