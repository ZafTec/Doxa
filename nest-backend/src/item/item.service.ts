import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {type CreateItemDto, type ItemQueryDto} from "./item.schema";
import type {Category, Item, Prisma} from "../../prisma/generated/client";
import {getPage, queryParameters} from "../shared/pagination";
import {ItemWhereInput} from "../../prisma/generated/models/Item";
import {PaginatedData} from "../shared/shared.types";

@Injectable()
export class ItemService {
    constructor(private readonly prisma: PrismaService) {}

    private buildItemFilters(filters: ItemQueryDto): Prisma.ItemWhereInput {
        const where: Prisma.ItemWhereInput = {}
        if (filters.brand){
            where.brand = {
                in: filters.brand
            }
        }
        if (filters.category){
            where.category = {
                name: {
                    in: filters.category
                }
            }
        }
        return where;
    }

    async getAll(queryParams: ItemQueryDto): Promise<PaginatedData<Item>>{

        const page = getPage(queryParams.pageNumber, queryParams.pageSize);
        const filters = this.buildItemFilters(queryParams);
        const databaseQueryParameters=queryParameters<ItemWhereInput>(page, filters)

        const totalCount = await this.prisma.item.count({where:databaseQueryParameters.where})
        const data: Item[] = await this.prisma.item.findMany(databaseQueryParameters)

        return {
            data,
            metadata: {
                pageNumber: page.pageNum,
                pageSize: page.pageSize,
                totalCount
            }
        }
    }

    async createItem(item: CreateItemDto) {
        const category: Category | null = await this.prisma.category.findUnique({
            where: {
                id: item.categoryId
            }
        })
        if (!category) {
            throw new BadRequestException("Category not found");
        }

        const createdItem: Item = await this.prisma.item.create({data: item})
        return createdItem;
    }

    async getItemById(id: string){
        const item = await this.prisma.item.findUnique({where:{id:id}})
        if (!item) {
            throw new NotFoundException("Item not found");
        }
        return item
    }
}
