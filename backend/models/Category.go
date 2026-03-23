package models

import "time"

type Category struct {
	CategoryId uint64    `gorm:"primary_key" json:"category_id"`
	Name       string    `gorm:"type:varchar(255)" json:"name"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
	Items      []Item    `gorm:"foreignKey:CategoryId"`
}
