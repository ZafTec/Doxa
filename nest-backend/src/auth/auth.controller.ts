import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentAdmin } from './decorators/current-admin.decorator';
import { ACCESS_TOKEN_COOKIE, accessTokenCookieOptions } from './cookie';
import type { AdminUserModel as AdminUser } from '../../prisma/generated/models';

function adminWebUrl(): string {
  return process.env.ADMIN_WEB_URL ?? 'http://localhost:3001';
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth(): void {
    // Guard redirects to Google's consent screen; body never runs.
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleCallback(@Req() req: Request, @Res() res: Response): void {
    const admin = req.user as AdminUser | false;
    if (!admin) {
      res.redirect(`${adminWebUrl()}/admin/login?error=not_authorized`);
      return;
    }

    const token = this.authService.issueToken(admin);
    res.cookie(ACCESS_TOKEN_COOKIE, token, accessTokenCookieOptions());
    res.redirect(`${adminWebUrl()}/admin`);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) res: Response): { ok: true } {
    res.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' });
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentAdmin() admin: AdminUser) {
    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
  }
}
