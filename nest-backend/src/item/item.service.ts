import {BadRequestException, Get, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {type CreateItemDto, type ItemQueryDto} from "./item.schema";
import type {Category, Item} from "../../prisma/generated/client";
import type {Prisma} from "../../prisma/generated/client";

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

    async getAll(filters: ItemQueryDto): Promise<Item[]>{
        return this.prisma.item.findMany({
            where: this.buildItemFilters(filters)
        });
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
