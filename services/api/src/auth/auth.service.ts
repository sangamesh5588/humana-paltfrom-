import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../database/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private readonly googleClient = new OAuth2Client();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(email: string, passwordPlain: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) return null;

    const isMatch = await bcrypt.compare(passwordPlain, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Omit<User, 'password'>): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    // Generate refresh token
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d', // Refresh token lives 7 days
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Persist refresh token
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    const fullUser = await this.usersService.findById(user.id);
    const { password, ...userWithoutPassword } = fullUser;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  async refreshTokens(tokenPlain: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(tokenPlain);
      
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: tokenPlain },
      });

      if (!storedToken || storedToken.revokedAt || new Date() > storedToken.expiresAt) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Rotate token: revoke old token
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() },
      });

      // Find user and generate new pair
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { password, ...userWithoutPassword } = user;
      return this.login(userWithoutPassword);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(tokenPlain: string): Promise<void> {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: tokenPlain },
    });

    if (storedToken) {
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() },
      });
    }
  }

  async loginWithGoogle(idToken: string): Promise<{ accessToken: string; refreshToken: string; user: Omit<User, 'password'> }> {
    try {
      let email: string;
      let googleId: string;
      let firstName: string;
      let lastName: string;

      const clientId = process.env.GOOGLE_CLIENT_ID;
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: clientId || undefined,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.sub) {
        throw new UnauthorizedException('Invalid Google token payload');
      }

      email = payload.email;
      googleId = payload.sub;
      firstName = payload.given_name || '';
      lastName = payload.family_name || '';
      const avatar = payload.picture || undefined;

      const user = await this.usersService.findOrCreateGoogleUser(
        email,
        googleId,
        firstName,
        lastName,
        avatar,
      );

      const { password, ...userWithoutPassword } = user;
      return this.login(userWithoutPassword);
    } catch (error) {
      throw new UnauthorizedException('Google authentication failed: ' + (error instanceof Error ? error.message : String(error)));
    }
  }
}

