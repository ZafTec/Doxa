package repository

import (
	"doxa_backend/models"
	"gorm.io/gorm"
)

type IOrderRepository interface {
	Create(order models.Order) (models.Order, error)
	Update(order models.Order) (models.Order, error)
	GetById(orderId uint64) (models.Order, error)
	GetAll() ([]models.Order, error)
}

type OrderRepository struct {
	connection *gorm.DB
}

func (orderRepo *OrderRepository) Create(order models.Order) (models.Order, error) {

	result := orderRepo.connection.Create(&order)
	if result.Error != nil {
		return models.Order{}, result.Error
	}
	return order, nil
}

func (orderRepo *OrderRepository) Update(order models.Order) (models.Order, error) {

	result := orderRepo.connection.Save(&order)
	if result.Error != nil {
		return models.Order{}, result.Error
	}
	return order, nil
}

func (orderRepo *OrderRepository) GetById(orderId uint64) (models.Order, error) {
	var order models.Order
	result := orderRepo.connection.First(&order, orderId)
	if result.Error != nil {
		return models.Order{}, result.Error
	}
	return order, nil
}

func (orderRepo *OrderRepository) GetAll() ([]models.Order, error) {
	var orders []models.Order
	result := orderRepo.connection.Find(&orders)
	if result.Error != nil {
		return []models.Order{}, result.Error
	}
	return orders, nil
}

func CreateOrderRepo(db *gorm.DB) IOrderRepository {
	return &OrderRepository{db}
}
