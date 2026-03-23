package models

import "time"

type Asset struct {
	AssetId       string `gorm:"primary_key" json:"asset_id"`
	ItemVariantId uint64
	ItemVariant   ItemVariant `gorm:"foreignKey:ItemVariantId" json:"item_variant"`
	URL           string      `json:"url"`
	CreatedAt     time.Time   `json:"created_at"`
	UpdatedAt     time.Time   `json:"updated_at"`
}
