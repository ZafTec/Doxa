package repository

import (
	"doxa_backend/models"
	"gorm.io/gorm"
)

type ICategoryRepository interface {
	Create(category models.Category) (models.Category, error)
	Update(category models.Category) (models.Category, error)
	GetById(categoryId uint64) (models.Category, error)
	GetAll() ([]models.Category, error)
}

type CategoryRepository struct {
	connection *gorm.DB
}

func (c *CategoryRepository) Create(category models.Category) (models.Category, error) {

	result := c.connection.Save(&category)
	if result.Error != nil {
		return models.Category{}, result.Error
	}
	return category, nil
}

func (c *CategoryRepository) Update(category models.Category) (models.Category, error) {

	result := c.connection.Save(&category)
	if result.Error != nil {
		return models.Category{}, result.Error
	}
	return category, nil
}

func (c *CategoryRepository) GetById(categoryId uint64) (models.Category, error) {
	var category models.Category
	result := c.connection.First(&category, categoryId)
	if result.Error != nil {
		return models.Category{}, result.Error
	}
	return category, nil
}

func (c *CategoryRepository) GetAll() ([]models.Category, error) {
	var categories []models.Category
	result := c.connection.Find(&categories)
	if result.Error != nil {
		return []models.Category{}, result.Error
	}
	return categories, nil
}

func CreateCategoryRepo(db *gorm.DB) ICategoryRepository {
	return &CategoryRepository{db}
}
