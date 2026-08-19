import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CreateItemDto,
  CreateItemVariantDto,
  ItemQueryDto,
} from './item.schema';
import type { Category, Item, Prisma } from '../../prisma/generated/client';
import { getPage, queryParameters } from '../shared/pagination';
import type { ItemWhereInput } from '../../prisma/generated/models/Item';
import { PaginatedData } from '../shared/shared.types';
import type { ItemDetailsDto, ItemListDto } from './item.dto';
import { itemRelations, toItemDetailsDto, toItemListDto } from './item.mapper';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  private buildItemFilters(filters: ItemQueryDto): Prisma.ItemWhereInput {
    const where: Prisma.ItemWhereInput = {};
    if (filters.brand) {
      where.brand = {
        in: filters.brand,
      };
    }
    if (filters.category) {
      where.category = {
        name: {
          in: filters.category,
        },
      };
    }
    return where;
  }

  async getAll(queryParams: ItemQueryDto): Promise<PaginatedData<ItemListDto>> {
    const page = getPage(queryParams.pageNumber, queryParams.pageSize);
    const filters = this.buildItemFilters(queryParams);
    const databaseQueryParameters = queryParameters<ItemWhereInput>(
      page,
      filters,
    );

    const totalCount = await this.prisma.item.count({
      where: databaseQueryParameters.where,
    });
    const data = await this.prisma.item.findMany({
      ...databaseQueryParameters,
      include: itemRelations,
    });

    return {
      data: data.map(toItemListDto),
      metadata: {
        pageNumber: page.pageNum,
        pageSize: page.pageSize,
        totalCount,
      },
    };
  }

  async createItem(item: CreateItemDto) {
    const category: Category | null = await this.prisma.category.findUnique({
      where: {
        id: item.categoryId,
      },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const createdItem: Item = await this.prisma.item.create({ data: item });
    return createdItem;
  }

  private async getItem(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: itemRelations,
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  async getItemDetails(id: string): Promise<ItemDetailsDto> {
    const item = await this.getItem(id);
    return toItemDetailsDto(item);
  }

  async createItemVariant(itemVariant: CreateItemVariantDto) {
    const item = await this.prisma.item.findUnique({
      where: {
        id: itemVariant.itemId,
      },
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return this.prisma.itemVariant.create({
      data: itemVariant,
    });
  }
}
