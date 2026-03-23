package models

import "time"

type ItemVariant struct {
	ItemVariantId string    `gorm:"primary_key" json:"item_variant_id"`
	Items         []Item    `gorm:"foreignKey:ItemId"`
	Color         string    `json:"color"`
	StockQuantity uint8     `json:"stock_quantity"`
	Price         uint8     `json:"price"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
