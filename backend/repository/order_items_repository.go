package repository

import (
	"doxa_backend/models"
	"gorm.io/gorm"
)

type IOrderItemsRepository interface {
	Create(order models.OrderItems) (models.OrderItems, error)
	Update(order models.OrderItems) (models.OrderItems, error)
	GetById(orderId uint64) (models.OrderItems, error)
	GetAll() ([]models.OrderItems, error)
}

type OrderItemsRepository struct {
	connection *gorm.DB
}

func (orderItemsRepo *OrderItemsRepository) Create(order_item models.OrderItems) (models.OrderItems, error) {

	result := orderItemsRepo.connection.Create(&order_item)
	if result.Error != nil {
		return models.OrderItems{}, result.Error
	}
	return order_item, nil
}

func (orderItemsRepo *OrderItemsRepository) Update(order_item models.OrderItems) (models.OrderItems, error) {

	result := orderItemsRepo.connection.Save(&order_item)
	if result.Error != nil {
		return models.OrderItems{}, result.Error
	}
	return order_item, nil
}

func (orderItemsRepo *OrderItemsRepository) GetById(orderId uint64) (models.OrderItems, error) {
	var order_item models.OrderItems
	result := orderItemsRepo.connection.First(&order_item, orderId)
	if result.Error != nil {
		return models.OrderItems{}, result.Error
	}
	return order_item, nil
}

func (orderItemsRepo *OrderItemsRepository) GetAll() ([]models.OrderItems, error) {
	var order_items []models.OrderItems
	result := orderItemsRepo.connection.Find(&order_items)
	if result.Error != nil {
		return []models.OrderItems{}, result.Error
	}
	return order_items, nil
}

func CreateOrderItemsRepo(db *gorm.DB) IOrderItemsRepository {
	return &OrderItemsRepository{db}
}
