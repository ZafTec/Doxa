import {Body, Controller, Get, Post, UsePipes, Query, Param} from '@nestjs/common';
import {ItemService} from "./item.service";
import {ZodValidationPipe} from "nestjs-zod";
import {
    type CreateItemDto,
    createItemSchema, type CreateItemVariantDto,
    createItemVariantSchema,
    getItemQuerySchema,
    type ItemQueryDto
} from "./item.schema";
import {getPage} from "../shared/pagination";
import type {Prisma} from "../../prisma/generated/client";

@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) {
    }

    @Get()
    async getAll(
        @Query(new ZodValidationPipe(getItemQuerySchema)) queryParams: ItemQueryDto
    ) {
        return this.itemService.getAll(queryParams)
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        console.log("The id is ",id)
        return this.itemService.getItemDetails(id)
    }

    @Get(':id/variant')
    async getVariant(@Param('id') id: string) {
        console.log("I am in the variant part")
        return this.itemService.getItemListOfVariants(id)
    }

    @Post('/create')
    async create(
        @Body(new ZodValidationPipe(createItemSchema)) item: CreateItemDto,
    ) {
        return this.itemService.createItem(item);
    }

    @Post('/createItemVariant')
    async createItemVariant(
        @Body(new ZodValidationPipe(createItemVariantSchema)) itemVariant: CreateItemVariantDto
    ){
        return this.itemService.createItemVariant(itemVariant);
    }
}
