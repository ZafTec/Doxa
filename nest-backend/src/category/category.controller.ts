import {Body, Controller, Get, Post, UsePipes} from '@nestjs/common';
import {CategoryService} from "./category.service";
import {type CreateCategoryDto, createCategorySchema} from "./category.schema";
import {ZodValidationPipe} from "nestjs-zod";
import {audioWorklet} from "globals";

@Controller('category')
export class CategoryController {

    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    async findAll(){
        return this.categoryService.findAll()
    }

    @Post('/create')
    @UsePipes(new ZodValidationPipe(createCategorySchema))
    async create(@Body() category: CreateCategoryDto) {
        return await this.categoryService.createCategory(category);
    }


}
