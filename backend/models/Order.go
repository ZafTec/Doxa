package models

import "time"

type Order struct {
	OrderId        uint64    `gorm:"primary_key" json:"category_id"`
	ContactDetails string    `gorm:"type:varchar(255)" json:"contact_details"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
	Status         string    `json:"status"`
	TotalAmount    int64     `json:"total_amount"`
}
