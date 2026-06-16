import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import type { CreateItemDto, CreateItemVariantDto,  ItemQueryDto} from "./item.schema";
import type {Category, Item, Prisma} from "../../prisma/generated/client";
import {getPage, queryParameters} from "../shared/pagination";
import {ItemWhereInput} from "../../prisma/generated/models/Item";
import {PaginatedData} from "../shared/shared.types";
import {AssetService} from "../asset/asset.service";

@Injectable()
export class ItemService {
    constructor(private readonly prisma: PrismaService, private readonly assetService: AssetService) {}

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
        const data = await this.prisma.item.findMany({
            ...databaseQueryParameters,
            include: {
                category: true,
                itemVariants: {
                    orderBy: { price: "asc" },
                    include: { assets: { select: { url: true } } },
                },
            },
        })

        return {
            data: data as unknown as Item[],
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

    async getItem(id: string) {
        const item = await this.prisma.item.findUnique({
            where:{
                id:id
            },
            include: {
                itemVariants: {
                    orderBy:{
                        price: "asc"
                    }
                }
            }
        })
        if (!item) {
            throw new NotFoundException("Item not found");
        }
        return item;
    }

    async getItemDetails(id: string){

        const item = await this.getItem(id)
        const firstItemName = item.itemVariants.length > 0 ? item.itemVariants[0].name : "No name"
        const firstItemVariantPrice = item.itemVariants.length > 0 ? item.itemVariants[0].price : 0
        const firstItemVariantDescription = item.itemVariants.length > 0 ? item.itemVariants[0].description : item.description
        const variants = await this.getItemListOfVariants(item.id)
        const urls = item.itemVariants.length > 0 ? await this.assetService.fetchAssetByItemVariantId(item.itemVariants[0].id) : []
        return {
            variants:variants?.itemVariants,
            price: firstItemVariantPrice,
            description: firstItemVariantDescription,
            assets: urls,
            name: firstItemName

        }
    }

    async getItemListOfVariants(id: string){
        const item = await this.getItem(id)
        const variants = await this.prisma.item.findUnique({
            where:{
                id: id
            },
            select:{
                itemVariants: {
                    select: {
                        id: true,
                        color:true,
                        price: true,
                    }
                }
            }
        })
        return variants;
    }

    async createItemVariant(itemVariant: CreateItemVariantDto){
        const item = await this.prisma.item.findUnique({
            where:{
                id:itemVariant.itemId
            }
        })

        return this.prisma.itemVariant.create({
            data: itemVariant,
        })
    }
}
