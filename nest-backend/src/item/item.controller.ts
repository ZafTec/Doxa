import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  type CreateItemDto,
  createItemSchema,
  type CreateItemVariantDto,
  createItemVariantSchema,
  getItemQuerySchema,
  type ItemQueryDto,
} from './item.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async getAll(
    @Query(new ZodValidationPipe(getItemQuerySchema)) queryParams: ItemQueryDto,
  ) {
    return this.itemService.getAll(queryParams);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.itemService.getItemDetails(id);
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  async create(
    @Body(new ZodValidationPipe(createItemSchema)) item: CreateItemDto,
  ) {
    return this.itemService.createItem(item);
  }

  @Post('/createItemVariant')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  async createItemVariant(
    @Body(new ZodValidationPipe(createItemVariantSchema))
    itemVariant: CreateItemVariantDto,
  ) {
    return this.itemService.createItemVariant(itemVariant);
  }
}
