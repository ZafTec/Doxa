package repository

import (
	"doxa_backend/models"
	"gorm.io/gorm"
)

type IPaymentRepository interface {
	Create(payment models.Payment) (models.Payment, error)
	Update(payment models.Payment) (models.Payment, error)
	GetById(paymentId uint64) (models.Payment, error)
	GetAll() ([]models.Payment, error)
}

type PaymentRepository struct {
	connection *gorm.DB
}

func (paymentRepo *PaymentRepository) Create(payment models.Payment) (models.Payment, error) {

	result := paymentRepo.connection.Create(&payment)
	if result.Error != nil {
		return models.Payment{}, result.Error
	}
	return payment, nil
}

func (paymentRepo *PaymentRepository) Update(payment models.Payment) (models.Payment, error) {

	result := paymentRepo.connection.Save(&payment)
	if result.Error != nil {
		return models.Payment{}, result.Error
	}
	return payment, nil
}

func (paymentRepo *PaymentRepository) GetById(paymentId uint64) (models.Payment, error) {
	var payment models.Payment
	result := paymentRepo.connection.First(&payment, paymentId)
	if result.Error != nil {
		return models.Payment{}, result.Error
	}
	return payment, nil
}

func (paymentRepo *PaymentRepository) GetAll() ([]models.Payment, error) {
	var payments []models.Payment
	result := paymentRepo.connection.Find(&payments)
	if result.Error != nil {
		return []models.Payment{}, result.Error
	}
	return payments, nil
}

func CreatePaymentRepo(db *gorm.DB) IPaymentRepository {
	return &PaymentRepository{db}
}
