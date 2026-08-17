import type { CookieOptions } from 'express';

export const ACCESS_TOKEN_COOKIE = 'access_token';

const DAYS = Number(process.env.JWT_EXPIRES_IN_DAYS ?? 7);

/** Seconds, not a "7d" string - @nestjs/jwt's SignOptions type only widens
 * string literals to a template-literal union, which a runtime-computed
 * string can't satisfy. */
export const jwtExpiresIn = DAYS * 24 * 60 * 60;

export function accessTokenCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: DAYS * 24 * 60 * 60 * 1000,
    path: '/',
  };
}
