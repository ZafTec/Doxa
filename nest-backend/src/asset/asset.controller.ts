import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AssetService } from './asset.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { type CreateAssetDto, createAssetSchema } from './asset.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  async createAsset(
    @Body(new ZodValidationPipe(createAssetSchema)) asset: CreateAssetDto,
  ) {
    await this.assetService.createAsset(asset);
    return {
      message: 'Assets Added',
    };
  }

  @Get('/:id')
  async getAssetByItemVariantId(@Param('id') id: string): Promise<string[]> {
    return this.assetService.fetchAssetByItemVariantId(id);
  }
}
