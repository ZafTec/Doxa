import type { Prisma } from '../../prisma/generated/client';
import type { ItemGetPayload } from '../../prisma/generated/models/Item';
import type { CategoryDto, ItemDetailsDto, ItemListDto } from './item.dto';

export const itemRelations = {
  category: true,
  itemVariants: {
    orderBy: { price: 'asc' },
    include: { assets: { select: { url: true } } },
  },
} satisfies Prisma.ItemInclude;

type ItemWithRelations = ItemGetPayload<{
  include: typeof itemRelations;
}>;

function toCategoryDto(item: ItemWithRelations): CategoryDto {
  return {
    id: item.category.id,
    name: item.category.name,
    createdAt: item.category.createdAt,
    updatedAt: item.category.updatedAt,
  };
}

export function toItemListDto(item: ItemWithRelations): ItemListDto {
  return {
    id: item.id,
    categoryId: item.categoryId,
    brand: item.brand,
    description: item.description,
    category: toCategoryDto(item),
    itemVariants: item.itemVariants.map((variant) => ({
      id: variant.id,
      itemId: variant.itemId,
      color: variant.color,
      stockQuantity: variant.stockQuantity,
      price: variant.price,
      description: variant.description,
      name: variant.name,
      assets: variant.assets.map((asset) => ({ url: asset.url })),
    })),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export function toItemDetailsDto(item: ItemWithRelations): ItemDetailsDto {
  return {
    id: item.id,
    brand: item.brand,
    description: item.description,
    category: toCategoryDto(item),
    variants: item.itemVariants.map((variant) => ({
      id: variant.id,
      color: variant.color,
      stockQuantity: variant.stockQuantity,
      price: variant.price,
      name: variant.name,
      description: variant.description,
      assets: variant.assets.map((asset) => asset.url),
    })),
  };
}
