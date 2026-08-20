import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import {
  internalS3Provider,
  publicS3SignerProvider,
} from './asset-storage.providers';

@Module({
  controllers: [AssetController],
  providers: [AssetService, internalS3Provider, publicS3SignerProvider],
  exports: [AssetService],
})
export class AssetModule {}
