import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  // The strategy's validate() resolves `false` (not a throw) for emails
  // outside the admin allowlist. Return that as-is instead of the default
  // 401 throw so the /auth/google/callback route can redirect to the login
  // page with a friendly error instead of rendering a raw JSON error.
  handleRequest<TUser = unknown>(err: unknown, user: TUser): TUser {
    if (err instanceof Error) throw err;
    if (err) throw new Error('Google auth failed', { cause: err });
    return user;
  }
}
