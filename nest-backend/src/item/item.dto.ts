export interface CategoryDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemAssetDto {
  url: string;
}

export interface ItemListVariantDto {
  id: string;
  itemId: string;
  color: string;
  stockQuantity: number;
  price: number;
  description: string;
  name: string;
  assets: ItemAssetDto[];
}

export interface ItemListDto {
  id: string;
  categoryId: string;
  brand: string;
  description: string;
  category: CategoryDto;
  itemVariants: ItemListVariantDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemDetailsVariantDto {
  id: string;
  color: string;
  stockQuantity: number;
  price: number;
  name: string;
  description: string;
  assets: string[];
}

export interface ItemDetailsDto {
  id: string;
  brand: string;
  description: string;
  category: CategoryDto;
  variants: ItemDetailsVariantDto[];
}
