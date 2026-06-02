package repository

import (
	"doxa_backend/models"
	"errors"
	"gorm.io/gorm"
)

type IAssetRepository interface {
	Create(variant models.Asset) (models.Asset, error)
	Update(variant models.Asset) (models.Asset, error)
	GetById(id uint64) (models.Asset, error)
	GetAll() ([]models.Asset, error)
}

type AssetRepository struct {
	connection *gorm.DB
}

func (assetRepo *AssetRepository) Create(asset models.Asset) (models.Asset, error) {
	result := assetRepo.connection.Create(&asset)
	if result.Error != nil {
		return models.Asset{}, result.Error
	}
	return asset, nil
}

func (assetRepo *AssetRepository) Update(updatedAsset models.Asset) (models.Asset, error) {

	result := assetRepo.connection.Model(&updatedAsset).Updates(updatedAsset)

	if result.Error != nil {
		return models.Asset{}, result.Error
	}
	if result.RowsAffected == 0 {
		return models.Asset{}, errors.New("Asset not found")
	}
	// fetchUpdated Values
	asset := models.Asset{}
	if err := assetRepo.connection.First(&asset, updatedAsset.AssetId).Error; err != nil {
		return models.Asset{}, err
	}

	return asset, nil

}

func (assetRepo *AssetRepository) GetById(id uint64) (models.Asset, error) {
	var asset models.Asset
	result := assetRepo.connection.First(&asset, id)
	if result.Error != nil {
		return models.Asset{}, result.Error
	}

	return asset, nil
}

func (assetRepo *AssetRepository) GetAll() ([]models.Asset, error) {
	var assets []models.Asset

	result := assetRepo.connection.Find(&assets)

	if result.Error != nil {
		return []models.Asset{}, result.Error
	}

	return assets, nil
}

func CreateAssetRepository(connection *gorm.DB) IAssetRepository {
	return &AssetRepository{
		connection: connection,
	}
}
