import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';
import { CategoryModule } from './category/category.module';
import { PrismaModule } from './prisma/prisma.module';
import { AssetModule } from './asset/asset.module';
import { AuthModule } from './auth/auth.module';
import { AdminUserModule } from './admin-user/admin-user.module';

@Module({
  imports: [
    PrismaModule,
    ItemModule,
    CategoryModule,
    ConfigModule.forRoot(),
    AssetModule,
    AuthModule,
    AdminUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
