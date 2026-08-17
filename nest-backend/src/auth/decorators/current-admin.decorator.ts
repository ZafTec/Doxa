import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AdminUserModel as AdminUser } from '../../../prisma/generated/models';
import type { AuthedRequest } from '../authed-request';

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AdminUser => {
    return ctx.switchToHttp().getRequest<AuthedRequest>().user;
  },
);
