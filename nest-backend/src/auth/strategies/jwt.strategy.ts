import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type StrategyOptionsWithoutRequest } from 'passport-jwt';
import type { Request } from 'express';
import { AuthService, type JwtPayload } from '../auth.service';
import type { AdminUserModel as AdminUser } from '../../../prisma/generated/models';

function extractFromCookie(req: Request): string | null {
  const cookies = req?.cookies as
    Record<string, string | undefined> | undefined;
  return cookies?.access_token ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is required for admin auth.');
    }
    const options: StrategyOptionsWithoutRequest = {
      jwtFromRequest: extractFromCookie,
      secretOrKey: secret,
    };
    super(options);
  }

  async validate(payload: JwtPayload): Promise<AdminUser> {
    return this.authService.getCurrentAdmin(payload);
  }
}
