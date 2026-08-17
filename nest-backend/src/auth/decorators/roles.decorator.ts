import { SetMetadata } from '@nestjs/common';
import type { AdminRole } from '../../../prisma/generated/enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AdminRole[]) => SetMetadata(ROLES_KEY, roles);
