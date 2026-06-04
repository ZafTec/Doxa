import {Body, Controller, Get, Post, UsePipes, Query} from '@nestjs/common';
import {ItemService} from "./item.service";
import {ZodValidationPipe} from "nestjs-zod";
import {type CreateItemDto, createItemSchema, getItemQuerySchema, type ItemQueryDto} from "./item.schema";

@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) {
    }

    @Get()
    async getAll(
        @Query(new ZodValidationPipe(getItemQuerySchema)) queryParams: ItemQueryDto
    ) {
        console.log("The query parameters are ",queryParams)
        return this.itemService.getAll(queryParams)
    }

    @Post('/create')
    async create(
        @Body(new ZodValidationPipe(createItemSchema)) item: CreateItemDto,
    ) {
        return this.itemService.createItem(item);
    }
}
