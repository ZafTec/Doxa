import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { AdminRole } from '../../../prisma/generated/enums';
import type { AuthedRequest } from '../authed-request';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const admin = context.switchToHttp().getRequest<AuthedRequest>().user;
    if (!admin || !requiredRoles.includes(admin.role)) {
      throw new ForbiddenException('Insufficient role for this action');
    }
    return true;
  }
}
