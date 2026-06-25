import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import {JwtModule} from "@nestjs/jwt";
import * as process from "node:process";
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigService
@Module({
  providers: [AdminService],
  controllers: [AdminController],
  // imports: [JwtModule.register({secret: process.env.JWT_SECRET})],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule here
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService], // Inject ConfigService to use it above
    }),
  ],
})
export class AdminModule {}
