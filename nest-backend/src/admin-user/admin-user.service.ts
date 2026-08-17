import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CreateAdminUserDto,
  UpdateAdminUserRoleDto,
} from './admin-user.schema';

@Injectable()
export class AdminUserService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.adminUser.findMany({ orderBy: { createdAt: 'asc' } });
  }

  create(data: CreateAdminUserDto) {
    return this.prisma.adminUser.create({ data });
  }

  async updateRole(
    id: string,
    currentAdminId: string,
    data: UpdateAdminUserRoleDto,
  ) {
    if (id === currentAdminId) {
      throw new ForbiddenException('Cannot change your own role');
    }
    const admin = await this.assertExists(id);
    if (admin.isProtected) {
      throw new ForbiddenException(
        'This admin is protected and cannot be modified',
      );
    }
    return this.prisma.adminUser.update({ where: { id }, data });
  }

  async remove(id: string, currentAdminId: string) {
    if (id === currentAdminId) {
      throw new ForbiddenException('Cannot remove your own admin access');
    }
    const admin = await this.assertExists(id);
    if (admin.isProtected) {
      throw new ForbiddenException(
        'This admin is protected and cannot be removed',
      );
    }
    await this.prisma.adminUser.delete({ where: { id } });
  }

  private async assertExists(id: string) {
    const admin = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!admin) throw new NotFoundException('Admin user not found');
    return admin;
  }
}
