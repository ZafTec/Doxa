package models

type OrderItems struct {
	OrderItemsId  uint64 `gorm:"primary_key" json:"order_items_id"`
	Quantity      uint64 `json:"quantity"`
	ItemVariantId uint64
	ItemVariant   ItemVariant `gorm:"foreignKey:ItemVariantId" json:"item_variant"`
	OrderId       uint64
	Order         Order  `gorm:"foreignKey:OrderId" json:"order"`
	UnitPrice     uint64 `json:"unit_price"`
}
