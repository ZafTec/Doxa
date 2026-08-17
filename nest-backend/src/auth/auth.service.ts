import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import type { AdminUserModel as AdminUser } from '../../prisma/generated/models';

export type GoogleProfile = {
  googleId: string;
  email: string;
  name?: string;
};

export type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Admins are an allowlist: a Google sign-in only succeeds if the email
   * already exists as an AdminUser row. Returns `null` (not a throw) so the
   * OAuth callback can redirect with a friendly error instead of a raw 401.
   */
  async validateGoogleAdmin(profile: GoogleProfile): Promise<AdminUser | null> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: profile.email },
    });
    if (!admin) return null;

    return this.prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        googleId: profile.googleId,
        name: admin.name ?? profile.name,
        lastLoginAt: new Date(),
      },
    });
  }

  issueToken(admin: AdminUser): string {
    const payload: JwtPayload = { sub: admin.id, email: admin.email };
    return this.jwtService.sign(payload);
  }

  /**
   * Re-fetches the admin on every authenticated request rather than trusting
   * the JWT payload's role, so revoking access or changing a role takes
   * effect on the admin's next request instead of only at token expiry.
   */
  async getCurrentAdmin(payload: JwtPayload): Promise<AdminUser> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: payload.sub },
    });
    if (!admin) {
      throw new UnauthorizedException('Admin account no longer exists');
    }
    return admin;
  }
}
