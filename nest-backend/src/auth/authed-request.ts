import type { Request } from 'express';
import type { AdminUserModel as AdminUser } from '../../prisma/generated/models';

/** `req.user`, as attached by Passport's JwtStrategy/GoogleStrategy validate(). */
export type AuthedRequest = Request & { user: AdminUser };
