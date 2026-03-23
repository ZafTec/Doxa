package models

import "time"

type Item struct {
	ItemId      string `gorm:"primary_key" json:"item_id"`
	CategoryId  uint64
	Brand       string    `json:"brand"`
	Description string    `gorm:"type:text" json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
