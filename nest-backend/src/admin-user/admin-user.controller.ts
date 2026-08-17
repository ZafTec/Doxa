import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { AdminUserService } from './admin-user.service';
import {
  type CreateAdminUserDto,
  createAdminUserSchema,
  type UpdateAdminUserRoleDto,
  updateAdminUserRoleSchema,
} from './admin-user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentAdmin } from '../auth/decorators/current-admin.decorator';
import type { AdminUserModel as AdminUser } from '../../prisma/generated/models';

@Controller('admin-user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get()
  findAll() {
    return this.adminUserService.findAll();
  }

  @Post('/create')
  create(
    @Body(new ZodValidationPipe(createAdminUserSchema))
    data: CreateAdminUserDto,
  ) {
    return this.adminUserService.create(data);
  }

  @Patch(':id')
  updateRole(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateAdminUserRoleSchema))
    data: UpdateAdminUserRoleDto,
    @CurrentAdmin() currentAdmin: AdminUser,
  ) {
    return this.adminUserService.updateRole(id, currentAdmin.id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentAdmin() currentAdmin: AdminUser) {
    return this.adminUserService.remove(id, currentAdmin.id);
  }
}
