import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            education: true,
            experience: true,
            originCountry: true,
            currentCountry: true,
          },
        },
      },
    });
  }

  async create(email: string, passwordPlain: string): Promise<User> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPlain, salt);

    // Create User and their empty Profile in a single transaction
    return this.prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          email,
          password: passwordHash,
        },
      });

      await tx.profile.create({
        data: {
          userId: user.id,
          firstName: '',
          lastName: '',
        },
      });

      return user;
    });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { googleId },
    });
  }

  async findOrCreateGoogleUser(
    email: string,
    googleId: string,
    firstName?: string,
    lastName?: string,
    avatar?: string,
  ): Promise<User> {
    // 1. Try to find by Google ID
    let user = await this.findByGoogleId(googleId);
    if (user) {
      // Always refresh the Google avatar — Google photo URLs can expire over time
      if (avatar) {
        await this.prisma.profile.updateMany({
          where: { userId: user.id },
          data: { avatar },
        });
      }
      return user;
    }

    // 2. Try to find by email
    user = await this.findByEmail(email);
    if (user) {
      // Link Google ID to existing account and ensure profile exists
      return this.prisma.$transaction(async (tx: any) => {
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: { googleId },
        });

        const existingProfile = await tx.profile.findUnique({
          where: { userId: user.id },
        });

        if (!existingProfile) {
          await tx.profile.create({
            data: {
              userId: user.id,
              firstName: firstName || '',
              lastName: lastName || '',
              avatar: avatar || null,
            },
          });
        } else if (avatar && (!existingProfile.avatar || existingProfile.avatar.includes('unsplash'))) {
          await tx.profile.update({
            where: { id: existingProfile.id },
            data: { avatar },
          });
        }

        return updatedUser;
      });
    }

    // 3. Create new user and profile
    return this.prisma.$transaction(async (tx: any) => {
      const newUser = await tx.user.create({
        data: {
          email,
          googleId,
        },
      });

      await tx.profile.create({
        data: {
          userId: newUser.id,
          firstName: firstName || '',
          lastName: lastName || '',
          avatar: avatar || null,
        },
      });

      return newUser;
    });
  }
}

