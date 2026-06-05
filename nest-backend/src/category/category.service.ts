import { Injectable } from '@nestjs/common';
import {Category} from "../../prisma/generated/client";
import {PrismaService} from "../prisma/prisma.service";
import {CreateCategoryDto} from "./category.schema";

@Injectable()
export class CategoryService {
    constructor(private readonly prismaService: PrismaService) {
    }
    async findAll(){
        const categories: Category[] = await this.prismaService.category.findMany();
        return categories;
    }

    async createCategory(category: CreateCategoryDto): Promise<Category> {
        const createdCategory: Category = await this.prismaService.category.create({
            data: category
        })

        return createdCategory
    }

}
