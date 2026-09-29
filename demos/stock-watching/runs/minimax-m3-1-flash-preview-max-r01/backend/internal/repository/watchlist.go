// Package repository 封装自选股与基础数据的数据访问逻辑。
package repository

import (
	"errors"
	"strings"

	"gorm.io/gorm"

	"stockwatch/backend/internal/apperr"
	"stockwatch/backend/internal/models"
)

// Repository 是数据访问层。
type Repository struct{ db *gorm.DB }

// New 构造 Repository。
func New(db *gorm.DB) *Repository { return &Repository{db: db} }

// Ping 用于健康检查探测数据库连通性。
func (r *Repository) Ping() error {
	if r.db == nil {
		return apperr.ErrUnavailable.WithField("database", "数据库未连接")
	}
	sqlDB, err := r.db.DB()
	if err != nil {
		return err
	}
	return sqlDB.Ping()
}

// guard 在数据库不可用时给出统一的 503，而不是让 handler 崩在 nil 指针上。
func (r *Repository) guard() error {
	if r.db == nil {
		return apperr.ErrUnavailable.WithField("database", "数据库未连接")
	}
	return nil
}

// ListMarkets 返回全部市场，按 sort_order 排序。
func (r *Repository) ListMarkets() ([]models.Market, error) {
	if err := r.guard(); err != nil {
		return nil, err
	}
	var markets []models.Market
	if err := r.db.Order("sort_order asc").Find(&markets).Error; err != nil {
		return nil, apperr.ErrInternal.WithCause(err)
	}
	return markets, nil
}

// ListSymbols 返回某市场下的代码列表。
func (r *Repository) ListSymbols(marketCode string) ([]models.Symbol, error) {
	if err := r.guard(); err != nil {
		return nil, err
	}
	var market models.Market
	if err := r.db.Where("code = ?", strings.ToUpper(marketCode)).First(&market).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperr.ErrNotFound.WithField("marketCode", "市场不存在")
		}
		return nil, apperr.ErrInternal.WithCause(err)
	}
	var symbols []models.Symbol
	if err := r.db.Where("market_id = ?", market.ID).Order("code asc").Find(&symbols).Error; err != nil {
		return nil, apperr.ErrInternal.WithCause(err)
	}
	return symbols, nil
}

// FindSymbol 按市场与代码定位一个 Symbol。
func (r *Repository) FindSymbol(marketCode, symbolCode string) (models.Symbol, models.Market, error) {
	if err := r.guard(); err != nil {
		return models.Symbol{}, models.Market{}, err
	}
	var market models.Market
	if err := r.db.Where("code = ?", strings.ToUpper(marketCode)).First(&market).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return models.Symbol{}, models.Market{}, apperr.ErrNotFound.WithField("marketCode", "市场不存在")
		}
		return models.Symbol{}, models.Market{}, apperr.ErrInternal.WithCause(err)
	}
	var symbol models.Symbol
	if err := r.db.Where("market_id = ? AND code = ?", market.ID, strings.ToUpper(symbolCode)).
		First(&symbol).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return models.Symbol{}, models.Market{}, apperr.ErrNotFound.WithField("symbolCode", "该市场下不存在此代码")
		}
		return models.Symbol{}, models.Market{}, apperr.ErrInternal.WithCause(err)
	}
	return symbol, market, nil
}

// ListWatchItems 返回某用户（可按市场过滤）的自选股。
func (r *Repository) ListWatchItems(userKey, marketCode string) ([]models.WatchItem, error) {
	if err := r.guard(); err != nil {
		return nil, err
	}
	q := r.db.Preload("Symbol").Preload("Market").
		Where("watch_items.user_key = ?", userKey)
	if marketCode != "" {
		q = q.Joins("JOIN markets ON markets.id = symbols.market_id").
			Where("markets.code = ?", strings.ToUpper(marketCode))
	}
	var items []models.WatchItem
	if err := q.Order("watch_items.sort_order asc, watch_items.id asc").Find(&items).Error; err != nil {
		return nil, apperr.ErrInternal.WithCause(err)
	}
	return items, nil
}

// FindWatchItem 取单条自选股，并校验归属。
func (r *Repository) FindWatchItem(userKey string, id uint) (models.WatchItem, error) {
	if err := r.guard(); err != nil {
		return models.WatchItem{}, err
	}
	var item models.WatchItem
	err := r.db.Preload("Symbol").Preload("Market").
		Where("id = ? AND user_key = ?", id, userKey).First(&item).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return models.WatchItem{}, apperr.ErrNotFound.WithField("id", "自选股不存在或不属于当前用户")
		}
		return models.WatchItem{}, apperr.ErrInternal.WithCause(err)
	}
	return item, nil
}

// CreateWatchItem 新增，重复添加返回 409。
func (r *Repository) CreateWatchItem(item models.WatchItem) (models.WatchItem, error) {
	if err := r.guard(); err != nil {
		return models.WatchItem{}, err
	}
	var count int64
	if err := r.db.Model(&models.WatchItem{}).
		Where("user_key = ? AND symbol_id = ?", item.UserKey, item.SymbolID).
		Count(&count).Error; err != nil {
		return models.WatchItem{}, apperr.ErrInternal.WithCause(err)
	}
	if count > 0 {
		return models.WatchItem{}, apperr.ErrConflict.WithField("symbolCode", "该代码已在自选股中")
	}
	if item.SortOrder == 0 {
		var maxOrder int64
		if err := r.db.Model(&models.WatchItem{}).
			Where("user_key = ?", item.UserKey).Select("COALESCE(MAX(sort_order), 0)").Scan(&maxOrder).Error; err != nil {
			return models.WatchItem{}, apperr.ErrInternal.WithCause(err)
		}
		item.SortOrder = int(maxOrder) + 1
	}
	if err := r.db.Create(&item).Error; err != nil {
		return models.WatchItem{}, apperr.ErrInternal.WithCause(err)
	}
	return r.FindWatchItem(item.UserKey, item.ID)
}

// UpdateWatchItem 按字段指针做部分更新。
func (r *Repository) UpdateWatchItem(userKey string, id uint, note *string, alertPrice *float64, clearAlert bool, sortOrder *int) (models.WatchItem, error) {
	if err := r.guard(); err != nil {
		return models.WatchItem{}, err
	}
	item, err := r.FindWatchItem(userKey, id)
	if err != nil {
		return models.WatchItem{}, err
	}
	updates := map[string]any{}
	if note != nil {
		item.Note = *note
		updates["note"] = *note
	}
	if clearAlert {
		item.AlertPrice = nil
		updates["alert_price"] = nil
	} else if alertPrice != nil {
		item.AlertPrice = alertPrice
		updates["alert_price"] = *alertPrice
	}
	if sortOrder != nil {
		item.SortOrder = *sortOrder
		updates["sort_order"] = *sortOrder
	}
	if len(updates) > 0 {
		if err := r.db.Model(&models.WatchItem{}).Where("id = ? AND user_key = ?", id, userKey).
			Updates(updates).Error; err != nil {
			return models.WatchItem{}, apperr.ErrInternal.WithCause(err)
		}
	}
	return r.FindWatchItem(userKey, id)
}

// DeleteWatchItem 删除一条自选股。
func (r *Repository) DeleteWatchItem(userKey string, id uint) error {
	if err := r.guard(); err != nil {
		return err
	}
	res := r.db.Where("id = ? AND user_key = ?", id, userKey).Delete(&models.WatchItem{})
	if res.Error != nil {
		return apperr.ErrInternal.WithCause(res.Error)
	}
	if res.RowsAffected == 0 {
		return apperr.ErrNotFound.WithField("id", "自选股不存在或不属于当前用户")
	}
	return nil
}
