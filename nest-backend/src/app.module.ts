import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';
import { CategoryModule } from './category/category.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule,ItemModule, CategoryModule, ConfigModule.forRoot() ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
