import {BadRequestException, Get, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {type CreateItemDto, type ItemQueryDto} from "./item.schema";
import type {Category, Item, Prisma} from "../../prisma/generated/client";
import {getPage, PaginatedData, queryParameters} from "../shared/pagination";
import {ItemWhereInput} from "../../prisma/generated/models/Item";
// import type {Prisma} from "../../prisma/generated/client";

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
            pageNumber: page.pageNum,
            pageSize: page.pageSize,
            totalCount
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
}
