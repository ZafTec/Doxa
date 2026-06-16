import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { AssetModule } from '../asset/asset.module';

@Module({
  controllers: [ItemController],
  providers: [ItemService],
  imports: [AssetModule],
})
export class ItemModule {}
