package repository

import (
	"doxa_backend/models"
	"errors"
	"gorm.io/gorm"
)

type IitemVariantRepository interface {
	Create(variant models.ItemVariant) (models.ItemVariant, error)
	Update(variant models.ItemVariant) (models.ItemVariant, error)
	GetById(id uint64) (models.ItemVariant, error)
	GetAll() ([]models.ItemVariant, error)
}

type ItemVariantRepository struct {
	connection *gorm.DB
}

func (itemVariantRepo *ItemVariantRepository) Create(variant models.ItemVariant) (models.ItemVariant, error) {
	result := itemVariantRepo.connection.Save(&variant)
	if result.Error != nil {
		return models.ItemVariant{}, result.Error
	}
	return variant, nil
}

func (itemVariantRepo *ItemVariantRepository) Update(variant models.ItemVariant) (models.ItemVariant, error) {

	result := itemVariantRepo.connection.Model(&variant).Updates(variant)

	if result.Error != nil {
		return models.ItemVariant{}, result.Error
	}
	if result.RowsAffected == 0 {
		return models.ItemVariant{}, errors.New("ItemVariant not found")
	}
	updatedItemVariant := models.ItemVariant{}
	if err := itemVariantRepo.connection.First(&updatedItemVariant, variant.ItemVariantId).Error; err != nil {
		return models.ItemVariant{}, err
	}

	return updatedItemVariant, nil

}

func (itemVariantRepo *ItemVariantRepository) GetById(id uint64) (models.ItemVariant, error) {
	var variant models.ItemVariant
	result := itemVariantRepo.connection.First(&variant, id)
	if result.Error != nil {
		return models.ItemVariant{}, result.Error
	}

	return variant, nil

}

func (itemVariantRepo *ItemVariantRepository) GetAll() ([]models.ItemVariant, error) {
	var variants []models.ItemVariant

	result := itemVariantRepo.connection.Find(&variants)
	if result.Error != nil {
		return []models.ItemVariant{}, result.Error
	}
	return variants, nil
}

func CreateItemVariantRepository(connection *gorm.DB) IitemVariantRepository {
	return &ItemVariantRepository{connection: connection}
}
