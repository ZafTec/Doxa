package models

import "time"

type Payment struct {
	PaymentId uint64    `gorm:"primary_key" json:"order_items_id"`
	OrderId   uint64    `gorm:"unique"`
	Order     Order     `gorm:"foreignKey:OrderId" json:"order"`
	UnitPrice uint64    `json:"unit_price"`
	Amount    uint64    `json:"amount"`
	Method    string    `json:"method"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	PaidAt    time.Time `json:"paid_at"`
}
