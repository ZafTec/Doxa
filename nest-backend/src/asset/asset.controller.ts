import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  type CompleteAssetUploadDto,
  completeAssetUploadSchema,
  type ImportAssetFromUrlDto,
  importAssetFromUrlSchema,
  type PresignAssetUploadDto,
  presignAssetUploadSchema,
} from './asset.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post('/uploads/presign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  async presignUpload(
    @Body(new ZodValidationPipe(presignAssetUploadSchema))
    dto: PresignAssetUploadDto,
  ) {
    return this.assetService.presignUpload(dto);
  }

  @Post('/uploads/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  async completeUpload(
    @Body(new ZodValidationPipe(completeAssetUploadSchema))
    dto: CompleteAssetUploadDto,
  ) {
    return this.assetService.completeUpload(dto);
  }

  @Post('/uploads/from-url')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  async importFromUrl(
    @Body(new ZodValidationPipe(importAssetFromUrlSchema))
    dto: ImportAssetFromUrlDto,
  ) {
    return this.assetService.importFromUrl(dto);
  }

  @Delete('/:assetId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  async deleteAsset(@Param('assetId') assetId: string) {
    return this.assetService.deleteAsset(assetId);
  }

  @Get('/by-variant/:itemVariantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  async listAssetsForVariant(@Param('itemVariantId') itemVariantId: string) {
    return this.assetService.listAssetsForVariant(itemVariantId);
  }

  @Get('/:id')
  async getAssetByItemVariantId(@Param('id') id: string): Promise<string[]> {
    return this.assetService.fetchAssetByItemVariantId(id);
  }
}
